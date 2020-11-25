const puppeteer = require('puppeteer');
const fs = require('fs');

const url = 'https://loja.chillibeans.com.br/oculos-de-sol-masculino-chilli-beans-quadrado-esportivo-flash-polarizado-oc-al-0179-0001/p';
const dir = __dirname + '/.carlosoculos';


async function primeiroacesso(){
    const browser = await puppeteer.launch({
        headless:false,
        defaultViewport:null,
        userDataDir:dir,
    });
    const page = await browser.newPage();
    await page.goto(url);
    await console.log('Acesso realizado na primeira vez, cache criado, feche manualmente o navegador!');
};

async function proximosacessos(){
    await console.time('#compra');
    const browser = await puppeteer.launch({
        headless:false,
        defaultViewport:null,
        userDataDir:dir,
    });
    const page = await browser.newPage();
    await page.goto(url);

    //ADICIONAR ITEM NO CARRINHO
    await page.waitForSelector('.buy-button-ref');
    await console.log('Esperou o bt de compra');
    await page.waitForTimeout(2500);
    await page.click('.buy-button-ref');
    await console.log('Produto adicionado no carrinho...');

    //ADICIONANDO CEP
    await page.waitForTimeout(4500);
    let setemcep = await page.$$eval('input[name="postalCode"]', ele => ele.length);
    
    if(setemcep === 0){
        console.log('Não precisa add cep!')
    }else{
        console.log('Precisa adicionar cep');
        await page.type('input[name="postalCode"]','00000-500', {delay:352});
        await console.log('CEP preenchido!');
    };

    //FINALIZAR A COMPRA
    await page.waitForSelector('.btn-custom-cart-to-orderform');
    await console.log('Esperou o bt de compra!');
    await page.waitForTimeout(1500);
    await page.click('.btn-custom-cart-to-orderform');
    await console.log('Compra finalizada!');

    //PREEENCHIMENTO DE DADOS DE COMPRA
    await page.waitForTimeout(1500);
    await page.waitForSelector('input[id="client-first-name"]');
    await page.type('input[id="client-first-name"]', '   Carlos', {delay:500});
    await console.log('Apareceu o primeiro nome, estou preenchendo...');
    await page.type('input[id="client-last-name"]', 'C. XXXX JR', {delay:200});
    await console.log('Preenchido segundo nome');
    await page.type('input[id="client-document"]', '000.000.000-000', {delay:200});
    await console.log('Preenchido CPF');
    await page.type('input[id="client-phone"]', '0000000000', {delay:200});
    await page.waitForSelector('.btn-submit-wrapper');
    await page.click('.btn-submit-wrapper');

    //ENTREGA
    await page.waitForSelector('input[id="ship-number"]');
    await console.log('Campo de numero apareceu...');
    await page.type('input[id="ship-number"]','000', {delay:300});
    await console.log('Número de entrega preenchido');
    await page.type('input[id="ship-receiverName"]','Carlos XXXXX', {delay:300});
    await page.click('.btn-go-to-payment');

    

    await browser.close();
    await console.timeEnd('#compra')
}

if(!fs.existsSync(dir)){
    console.log('Diretório não existe');
    primeiroacesso();
}else{
    console.log('Diretório Existe');
    proximosacessos();
}