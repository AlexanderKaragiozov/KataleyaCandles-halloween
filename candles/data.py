CANDLES = [
    {
        "slug": "santa-claus",
        "name": "Дядо Коледа",
        "scent": "джинджифил, бисквитки",
        "price": 18,
        "description": "Веселият Дядо Коледа носи радост и аромат на прясно изпечени джинджифилови бисквитки.",
        "image": "images/santa.png",
        "is_upsell": True
    },
    {
        "slug": "frosty-snowman",
        "name": "Снежен Човек",
        "scent": "мента, ванилия",
        "price": 18,
        "description": "Свеж като зимен въздух с нотки на мента и мека ванилия. Идеална компания за горещ шоколад.",
        "image": "images/snowman.png",
        "is_upsell": True
    },
    {
        "slug": "festive-tree",
        "name": "Коледна Елха",
        "scent": "смърч, борови иглички",
        "price": 20,
        "description": "Автентичен аромат на жива коледна елха, който ще изпълни дома ви с празнично настроение.",
        "image": "images/tree.jpg",
        "is_upsell": True
    },
    {
        "slug": "sweet-chocolate",
        "name": "Шоколадово Изкушение",
        "scent": "лешник, черен шоколад",
        "price": 16,
        "description": "Богат и наситен аромат на шоколад, който ще задоволи сетивата ви без никакви калории.",
        "image": "images/choco.jpg",
        "is_upsell": False
    },
    {
        "slug": "dark-chocolate-delight",
        "name": "Тъмен Шоколад",
        "scent": "тъмен шоколад, еспресо",
        "price": 16,
        "description": "Интензивен аромат на тъмен шоколад с леки нотки на еспресо за истински ценители.",
        "image": "images/choco2.jpg",
        "is_upsell": False
    },
    {
        "slug": "royal-red",
        "name": "Кралско Червено",
        "scent": "червена боровинка, нар",
        "price": 16,
        "description": "Елегантен и плодов аромат на червени боровинки, създаващ усещане за лукс и празник.",
        "image": "images/red.jpg",
        "is_upsell": False
    },
    {
        "slug": "blue-christmas",
        "name": "Снежна Приказка",
        "scent": "евкалипт, скреж",
        "price": 16,
        "description": "Свеж и прохладен аромат, напомнящ за кристално чиста зимна нощ.",
        "image": "images/blue.jpg",
        "is_upsell": False
    },
]

def get_candle_by_slug(slug):
    for candle in CANDLES:
        if candle["slug"] == slug:
            return candle
    return None
