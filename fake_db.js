module.exports = {
    tags: [
        {
            id: 0xdeadbeef,
            name: "bar",
            color: 0xff00ff,
        },
        {
            id: 0xc0ffee,
            name: "coffee",
            color: 0x00ff00,
        },
    ],
    articles: [
        {
            title: "Foo",
            tags: [0xdeadbeef, 0xc0ffee],
            read: false,
            url: "https://google.com",
            notes: "fake note",
            length: "4 min",
            added_on: new Date('September 22, 2018 15:00:00'),
        },
        {
            title: "Egg",
            tags: [0xc0ffee],
            read: false,
            url: "https://dev.to",
            notes: "a nice note",
            length: "1 min",
            added_on: new Date('December 25, 2020 15:00:00'),
        },
    ],
}
