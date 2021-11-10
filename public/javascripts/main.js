function focus_ce(node) {
    let setpos = document.createRange()
    let set = window.getSelection()
    setpos.setStart(node.childNodes[0], node.innerText.length)
    setpos.collapse(true)
    set.removeAllRanges()
    set.addRange(setpos)

    node.focus()
}

async function before_submit_article() {
    let input = new TagsInput('.tags-input')

    const tags = Array.from(Object.values(input.tags)).map(el => el.innerText)
    const title = document.getElementById("title").value
    const url = document.getElementById("url").value
    const notes = document.getElementById("notes").value

    const req = await fetch("/articles/add", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            tags: tags,
            title: title,
            url: url,
            notes: notes,
        }),
    })
    const res = await req.json()

    if (res) {
        close_add_article()
        window.location.reload(true)
    }
}

function add_article() {
    if (!Object.prototype.hasOwnProperty.call(window, "adding_article") || window.adding_article !== true) {
        window.adding_article = true
    } else {
        return
    }

    let new_node = document.createElement("div")
    new_node.setAttribute("id", "add_article")
    new_node.classList.add("article")
    new_node.innerHTML = `<form>
        <table>
            <tr>
                <td></td>
                <td style="float: right" onclick="close_add_article()">&times;</td>
            </tr>
            <tr>
                <td>
                    <label for="title">Article title</label>
                </td>
                <td>
                    <input type="text" placeholder="Title" id="title" name="title" required>
                </td>
            </tr>
            <tr>
                <td>
                    <label for="url">URL</label>
                </td>
                <td>
                    <input type="text" placeholder="https://example.com" id="url" name="url" required>
                </td>
            </tr>
            <tr>
                <td>
                    <label for="tags">Tags</label>
                </td>
                <td>
                    <div class="tags-input"></div>
                </td>
            </tr>
            <tr>
                <td>
                    <label for="notes">Notes</label>
                </td>
                <td>
                    <textarea rows="5" placeholder="Notes" id="notes" name="notes"></textarea>
                </td>
            </tr>
        </table>

        <select hidden multiple="multiple" id="add_article_select_tags" name="tags">
        </select>

        <input onclick="before_submit_article()" type="button" value="Send">
    </form>`

    let container = document.getElementsByClassName("container")[0]
    if (container.children.length > 1) {
        container.insertBefore(new_node, container.children[1])
    } else {
        container.appendChild(new_node)
    }

    new TagsInput('.tags-input');
}

function close_add_article() {
    window.adding_article = false
    const el = document.getElementById('add_article')
    if (el) {
        el.remove()
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

async function delete_article(articleID) {
    if (confirm("Are you sure you want to delete this article?")) {
        const req = await fetch(`/articles/${articleID}`, {
            method: "DELETE",
        })
        const res = req.json()
        if (res) {
            alert("Success")
            window.location.reload(true)
        }
    }
}

async function before_submit_tag() {
    const name = document.getElementById("name").value
    const color = document.getElementById("color").value.slice(1)

    let old = ""
    if (Object.prototype.hasOwnProperty.call(window, "edit_tag")) {
        old = window.edit_tag
    }

    if (old !== "") {
        await fetch(`/tags/${old}`, {
            method: "DELETE",
        })
    }

    const req = await fetch("/tags/add", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: name,
            color: color,
        }),
    })
    const res = await req.json()

    if (res) {
        close_add_tag()
        window.location.reload(true)
    }
}

function add_tag() {
    if (!Object.prototype.hasOwnProperty.call(window, "adding_tag") || window.adding_tag !== true) {
        window.adding_tag = true
    } else {
        return
    }

    let new_node = document.createElement("div")
    new_node.setAttribute("id", "adding_tag")
    new_node.classList.add("article")
    new_node.innerHTML = `<form>
        <table>
            <tr>
                <td></td>
                <td style="float: right" onclick="close_add_tag()">&times;</td>
            </tr>
            <tr>
                <td>
                    <label for="name">Tag name</label>
                </td>
                <td>
                    <input type="text" placeholder="tag name" id="name" name="name" required>
                </td>
            </tr>
            <tr>
                <td>
                    <label for="color">Color</label>
                </td>
                <td>
                    <input type="color" id="color" name="color" required>
                </td>
            </tr>
        </table>

        <input onclick="before_submit_tag()" type="button" value="Send">
    </form>`

    let container = document.getElementsByClassName("container")[0]
    if (container.children.length > 1) {
        container.insertBefore(new_node, container.children[1])
    } else {
        container.appendChild(new_node)
    }
}

function close_add_tag() {
    window.adding_tag = false
    const el = document.getElementById('adding_tag')
    if (el) {
        el.remove()
    }
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

async function edit_tag(tagID) {
    close_add_tag()
    add_tag()
    window.edit_tag = tagID
    document.getElementById("name").value = tagID
    const req = await fetch(`/tags/${tagID}`)
    const res = await req.json()
    document.getElementById("color").value = "#" + res.color
}
