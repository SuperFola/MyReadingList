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
            read: !currentState,
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

async function edit_note(articleID) {
    let div = document.getElementById(`article-${articleID}`)
    let inner_notes = div.children[3].children[1]

    if (!["true", true].includes(inner_notes.contentEditable)) {
        inner_notes.contentEditable = true

        let setpos = document.createRange()
        let set = window.getSelection()
        setpos.setStart(inner_notes.childNodes[0], inner_notes.innerText.length)
        setpos.collapse(true)
        set.removeAllRanges()
        set.addRange(setpos)

        inner_notes.focus()
    } else {
        // save
        inner_notes.contentEditable = false

        const req = await fetch(`/articles/${articleID}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                notes: inner_notes.innerText,
            }),
        })
        const res = await req.json()
    }
}