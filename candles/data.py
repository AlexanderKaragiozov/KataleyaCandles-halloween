CANDLES = [
    {
        "slug": "santa-claus",
        "name": "Дядо Коледа",
        "scent": "шоколадови бисквитки, ваниля",
        "price": 7.99,
        "description": "Веселият Дядо Коледа носи радост и аромат на портокалови корички и канела.",
        "image": "images/santa.png",
        "is_upsell": True
    },
    {
        "slug": "frosty-snowman",
        "name": "Снежен Човек",
        "scent": "ванилия",
        "price": 7.99,
        "description": "Аромат на ванилия, който ще задоволи вашия вкус.",
        "image": "images/snowman.png",
        "is_upsell": True
    },
    {
        "slug": "festive-tree",
        "name": "Коледна Елха",
        "scent": "ванилия",
        "price": 7.99,
        "description": "Автентичен аромат на жива коледна елха, който ще изпълни дома ви с празнично настроение.",
        "image": "images/tree.jpg",
        "is_upsell": True
    },
    {
        "slug": "sweet-chocolate",
        "name": "Шоколадово Тирамису",
        "scent": "лешник, черен шоколад",
        "price": 25,
        "description": "Богат и наситен аромат на тирамису, който ще задоволи сетивата ви без никакви калории.",
        "image": "images/choco.jpg",
        "is_upsell": False
    },
    {
        "slug": "dark-chocolate-delight",
        "name": "Тъмен Шоколад",
        "scent": "тъмен шоколад, бисквитки",
        "price": 25,
        "description": "Интензивен аромат на тъмен шоколад и шоколадови бисквитки",
        "image": "images/choco2.jpg",
        "is_upsell": False
    },
    {
        "slug": "royal-red",
        "name": "Червен Шоколад",
        "scent": "червена боровинка, щоколад",
        "price": 25,
        "description": "Елегантен и плодов аромат на червени боровинки и шоколад, създаващ усещане за лукс и празник.",
        "image": "images/red.jpg",
        "is_upsell": False
    },
    {
        "slug": "blue-christmas",
        "name": "Снежна Приказка",
        "scent": "ванилия, ягода",
        "price": 25,
        "description": "Аромат на ванилия и ягода, който ще задоволи вашия вкус.",
        "image": "images/blue.jpg",
        "is_upsell": False
    },
]

def get_candle_by_slug(slug):
    for candle in CANDLES:
        if candle["slug"] == slug:
            return candle
    return None
