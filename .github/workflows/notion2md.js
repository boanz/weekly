import { Client } from '@notionhq/client';
import moment from 'moment';
import fs from 'fs';
import path from 'path';
import dotEnv from 'dotenv'
import OSS from 'ali-oss';
import https from 'https';
import crypto from 'crypto';

if (!process.env.GITHUB_ACTIONS) {
    dotEnv.config();
}

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const databaseId = process.env.NOTION_DATABASE_ID;

// 初始化阿里云 OSS 客户端
const ossClient = new OSS({
    accessKeyId: process.env.OSS_ACCESS_KEY_ID,
    accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET,
    bucket: process.env.OSS_BUCKET,
    region: process.env.OSS_REGION
});

const CONFIG = {
    days: 7,
    dir: './src/pages/posts',
    filename: '本周见闻'
}

// 下载图片函数
function downloadImage(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            if (res.statusCode !== 200) {
                reject(new Error(`Failed to download image: ${res.statusCode}`));
                return;
            }
            const chunks = [];
            res.on('data', chunk => chunks.push(chunk));
            res.on('end', () => resolve(Buffer.concat(chunks)));
        }).on('error', reject);
    });
}

// 添加 MD5 哈希函数
function generateMD5(buffer) {
    return crypto.createHash('md5').update(buffer).digest('hex');
}

// 修改上传到 OSS 的函数
async function uploadToOSS(imageBuffer, originalFileName) {
    try {
        // 生成图片的 MD5 值
        const md5Hash = generateMD5(imageBuffer);
        const fileExtension = path.extname(originalFileName) || '.jpg';
        const fileName = `images/${md5Hash}${fileExtension}`;

        // 检查文件是否已存在
        try {
            await ossClient.head(fileName);
            console.log(`File ${fileName} already exists, skipping upload`);
            return `${process.env.OSS_DOMAIN}/${fileName}`; // 返回完整的URL
        } catch (error) {
            if (error.code === 'NoSuchKey') {
                // 文件不存在，执行上传
                const result = await ossClient.put(fileName, imageBuffer);
                return result.url;
            }
            throw error;
        }
    } catch (error) {
        console.error('Error uploading to OSS:', error);
        throw error;
    }
}

// 修改处理微信图片的函数
async function processWeChatImage(url) {
    try {
        const imageBuffer = await downloadImage(url);
        const originalFileName = url.split('/').pop() || 'image.jpg';
        const ossUrl = await uploadToOSS(imageBuffer, originalFileName);
        return ossUrl;
    } catch (error) {
        console.error('Error processing WeChat image:', error);
        return url; // 如果处理失败，返回原始URL
    }
}

const curTime = moment(Date.now());
const today = curTime.format('YYYY-MM-DD');
const startDay = moment(curTime).subtract(CONFIG.days, 'days').format('YYYY-MM-DD')

function formatStr(str) {
    const reg1 = /[<>'"]/g
    const reg2 = /([^\n\r\t\s]*?)((http|https):\/\/[\w\-]+\.[\w\-]+[^\s]*)/g

    if (!!str && str.trim()) {
        str = str.replace(reg1, '')
        const url = str.replace(reg2, (a, b, c) => (b + '<' + c + '>'))
        return url
    }
    return str
}

function isWeChatImage(url) {
    return url && url.includes('mmbiz.qpic.cn');
}

async function main() {
    try {
        const response = await notion.databases.query({
            database_id: databaseId,
            filter: {
                and: [
                    {
                        property: 'date',
                        date: {
                            on_or_after: startDay
                        }
                    },
                    {
                        property: 'date',
                        date: {
                            on_or_before: today
                        }
                    }
                ],
                sorts: [
                    {
                        property: "date",
                        direction: "ascending"
                    }
                ],
            }
        });

        if (!response.results.length) {
            console.log('no data')
            return
        }

        let mid = (`${startDay}_${today}`).replace(/-/g, '')
        let mdHead = `---\ndate: ${today.replace(/-/g, '/')}\ntoc: true\n---\n\n`
        let mdContent = ''
        let secData = {}
        let mdImg = ''
        function setMdImg(img, txt) {
            let desc = txt ? `<small>${txt}</small>\n\n` : ''
            return `<img src="${img}" width="800" />\n\n${desc}`
        }

        let index = 0;
        for (const page of response.results) {
            let cover = page.cover?.external?.url || page.cover?.file.url
            const props = page.properties
            const title = props.title?.title[0].plain_text
            const link = props.link.url
            const content = (props.desc?.rich_text.map(item => item.plain_text).join('') || '') + (link ? `${link}` : '')
            let img = props.img?.files[0]?.file?.url || props.img?.files[0]?.external?.url || ''
            const imgDesc = props.imgDesc?.rich_text[0]?.plain_text || ''

            // 处理微信图片
            if (isWeChatImage(cover)) {
                cover = await processWeChatImage(cover);
            }
            if (isWeChatImage(img)) {
                img = await processWeChatImage(img);
            }

            const _content = content
            const targetStr = formatStr(_content)
            const tag = (props.tags.multi_select && props.tags.multi_select[0]?.name) || props.tags.select?.name
            const oneImg = cover ? `![](${cover})` : ''

            if (tag) {
                if (!secData[tag]) {
                    secData[tag] = []
                    secData[tag].index = 0
                }
                let idx = secData[tag].index++
                const oneMsg = `**${idx + 1}、${title.trim()}**\n\n${targetStr}\n\n${oneImg}\n\n`
                secData[tag].push(oneMsg)
            }

            if (img) {
                mdImg = setMdImg(img, imgDesc)
            }

            index += 1;
        }

        Object.keys(secData).map(key => {
            mdContent += `## ${key}\n${secData[key].join('')}`
        })

        const existingFiles = fs.readdirSync(CONFIG.dir).filter(file => !file.startsWith('.')) // ignore hidden files
        const existingFile = existingFiles.find(file => file.includes(mid));

        let filePath = ''
        if (existingFile) {
            filePath = path.join(CONFIG.dir, existingFile);
        } else {
            const fileCount = existingFiles.length;
            const fileName = `${(fileCount < 10 ? '0' + fileCount : fileCount) + '-' + (CONFIG.filename || today)}-${mid}.md`;
            filePath = path.join(CONFIG.dir, fileName);
        }

        const fileContent = `${mdHead + mdImg + mdContent}`;
        fs.writeFileSync(filePath, fileContent);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
}

main()
