module.exports = {
    tags: [
        {
            name: "bar",
            color: 0xff00ff,
        },
        {
            name: "coffee",
            color: 0x00ff00,
        },
    ],
    articles: [
        {
            id: 0,
            title: "Foo",
            tags: ["bar", "coffee"],
            read: false,
            url: "https://google.com",
            notes: "fake note",
            length: "4 min",
            added_on: new Date('September 22, 2018 15:00:00'),
        },
        {
            id: 1,
            title: "Egg",
            tags: ["coffee"],
            read: false,
            url: "https://dev.to",
            notes: "a nice note",
            length: "1 min",
            added_on: new Date('December 25, 2020 15:00:00'),
        },
    ],
}
