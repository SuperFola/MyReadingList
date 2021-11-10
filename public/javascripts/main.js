function focus_ce(node) {
    let setpos = document.createRange()
    let set = window.getSelection()
    setpos.setStart(node.childNodes[0], node.innerText.length)
    setpos.collapse(true)
    set.removeAllRanges()
    set.addRange(setpos)

    node.focus()
}

async function add_article() {
    if (!Object.prototype.hasOwnProperty.call(window, "adding_article")) {
        window.adding_article = true
    } else {
        return
    }

    const req = await fetch("/tags/list")
    let tags = await req.json()
    tags = tags.map(val => {
        return `<option value="${val.name}" style="background-color: #${val.color}">${val.name}</option>`
    })

    let new_node = document.createElement("div")
    new_node.setAttribute("id", "add_article")
    new_node.classList.add("article")
    new_node.innerHTML = `<form action="/articles/add" method="POST">
        <label for="title">Article title</label><br>
        <input type="text" placeholder="Title" id="title" name="title" required><br>

        <label for="url">URL</label><br>
        <input type="text" placeholder="https://example.com" id="url" name="url" required><br>

        <label for="tags">Tags</label><br>
        <select id="tags" name="tags" multiple="multiple">
            ${tags}
        </select><br>

        <label for="notes">Notes</label><br>
        <textarea cols="40" rows="5" placeholder="Notes" id="notes" name="notes"></textarea><br>

        <input type="submit" value="Send">
    </form>`

    let container = document.getElementsByClassName("container")[0]
    if (container.children.length > 1) {
        container.insertBefore(new_node, container.children[1])
    } else {
        container.appendChild(new_node)
    }
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
        focus_ce(inner_notes)
    } else {
        // save
        inner_notes.contentEditable = false

        await fetch(`/articles/${articleID}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                notes: inner_notes.innerText,
            }),
        })
    }
}
