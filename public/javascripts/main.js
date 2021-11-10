function add_article() {
    console.log("add article")
}

async function article_change_state(currentState, articleID) {
    const req = await fetch(`/articles/${articleID}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            read: !currentState
        }),
    })
    const res = await req.json()

    if (res) {
        let div = document.getElementById(`article-${articleID}`)
        let read = div.children[1].children[1]

        if (currentState) {
            read.children[0].classList.replace("read", "not_read")
            read.children[0].innerText = "Not read"
            read.onclick = _ => {
                article_change_state(false, articleID)
            }
        } else {
            read.children[0].classList.replace("not_read", "read")
            read.children[0].innerText = "Read"
            read.onclick = _ => {
                article_change_state(true, articleID)
            }
        }
    }
}

function add_tag() {
    console.log("add tag")
}

function edit_note(articleID) {
    console.log("edit note", articleID)
}