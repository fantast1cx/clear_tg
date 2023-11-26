let tg = window.Telegram.WebApp;
tg.MainButton.textColor = '#FFFFFF';
tg.MainButton.color = '#2cab37';
tg.expand();

const items = document.querySelectorAll('.item');

let target_item = {
    chat_id: tg.initDataUnsafe.user?.id,
    user_name: tg.initDataUnsafe.user?.username,
    id: '',
    name: '',
    price: 100,
    desc: ''
};

let invoice_link = '';




tg.onEvent('mainButtonClicked', () => {

    tg.openInvoice(invoice_link);

});

tg.onEvent('invoiceClosed', () => {

    tg.MainButton.hide();
    items.forEach(i => i.classList.remove('item--active'));

});


items.forEach(item => {

    item.onclick = async e => {

        items.forEach(i => i.classList.remove('item--active'));
        item.classList.add('item--active');

        target_item.id = item.dataset.id;
        target_item.name = item.querySelector('.item__name').innerText;
        target_item.price = 100;
        target_item.desc = item.dataset.desc;

        if (tg.MainButton.isVisible) tg.MainButton.hide();
        tg.MainButton.setText('Оплатить');
        tg.MainButton.show();

        invoice_link = await get_invoice(target_item);

    };

});


async function get_invoice(invoice_data) {

    let data = await fetch('/get_invoice', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(invoice_data)
    })
    .then(res => res.text())
    .catch(err => console.log(err));

    return data;

}
