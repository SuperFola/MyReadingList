function focus_ce(node) {
    let setpos = document.createRange()
    let set = window.getSelection()
    let start = node.innerText.length
    if (node.childNodes[0].innerText === "⠀") {
        start = 0
    }
    setpos.setStart(node.childNodes[0], start)
    setpos.collapse(true)
    set.removeAllRanges()
    set.addRange(setpos)

    node.focus()
}

async function login_or_signup(target) {
    const username = document.getElementById("username").value
    const password = document.getElementById("password").value

    const req = await fetch(`/${target}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username: username,
            password: password,
        }),
    })

    const res = await req.json()

    if (req.status === 200) {
        switch (target) {
            case "signup":
                login_or_signup("login")
                break

            case "login":
                window.location.href = "/home"
                break
        }
    } else {
        alert(res.message)
    }
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
            notes: notes.trim().length === 0 ? "⠀" : notes,
        }),
    })
    const res = await req.json()

    if (req.status === 200) {
        close_add_article()
        window.location.reload(true)
    } else {
        alert(`An error occured: ${res.message}`)
    }
}

function add_article() {
    if (!Object.prototype.hasOwnProperty.call(window, "adding_article") || window.adding_article !== true) {
        window.adding_article = true
    } else {
        return
    }

    window.scrollTo(0, -9999);

    let new_node = document.createElement("div")
    new_node.setAttribute("id", "add_article")
    new_node.classList.add("article")
    new_node.innerHTML = `<form>
        <table>
            <tr>
                <td></td>
                <td class="pointer delete_article" onclick="close_add_article()">&times;</td>
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

    if (req.status === 200) {
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
    } else {
        alert(`An error occured: ${res.message}`)
    }
}

async function delete_article(articleID) {
    if (confirm("Are you sure you want to delete this article?")) {
        const req = await fetch(`/articles/${articleID}`, {
            method: "DELETE",
        })
        const res = req.json()
        if (req.status == 200) {
            alert("Success")
            window.location.reload(true)
        } else {
            alert(`An error occured: ${res.message}`)
        }
    }
}

async function delete_tag(tagID) {
    if (confirm(`Are you sure you want to delete this tag (${tagID})?`)) {
        const req = await fetch(`/tags/${tagID}`, {
            method: "DELETE",
        })
        const res = req.json()
        if (req.status === 200) {
            alert("Success")
            window.location.reload(true)
        } else {
            alert(`An error occured: ${res.message}`)
        }
    }
}

async function before_submit_tag() {
    const name = document.getElementById("name").value
    const color = document.getElementById("color").value.slice(1)

    let old = ""
    if (Object.prototype.hasOwnProperty.call(window, "old_tag")) {
        old = window.old_tag
        window.old_tag = ""
    }

    let req = null

    if (old !== "") {
        req = await fetch(`/tags/${old}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: name,
                color: color,
            }),
        })
    } else {
        req = await fetch("/tags/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: name,
                color: color,
            }),
        })
    }

    const res = await req.json()

    if (req.status === 200) {
        close_add_tag()
        window.location.reload(true)
    } else {
        alert(`An error occured: ${res.message}`)
    }
}

function add_tag() {
    if (!Object.prototype.hasOwnProperty.call(window, "adding_tag") || window.adding_tag !== true) {
        window.adding_tag = true
    } else {
        return
    }

    window.scrollTo(0, -9999);

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
    let tags = div.children[2]
    let inner_notes = div.children[3].children[1]

    function create_delete_tag_btn(el) {
        let span = document.createElement("span")
        span.innerHTML = "&times;"
        span.classList.add("tag_delete", "tag_bubble", "pointer")
        span.onclick = _ => el.remove()
        el.appendChild(span)
    }

    if (!["true", true].includes(inner_notes.contentEditable)) {
        Array.from(tags.children).forEach(create_delete_tag_btn)

        let add_btn = document.createElement("span")
        add_btn.innerHTML = "&plus;"
        add_btn.classList.add("tag_add", "tag_bubble", "pointer")
        add_btn.onclick = _ => {
            const tag_name = prompt("New tag to add")
            if (tag_name.trim().length !== 0) {
                let span = document.createElement("span")
                span.classList.add("tag")
                span.style.backgroundColor = "ffffff"
                span.innerHTML= `<a href="/articles/tagged/${tag_name}">${tag_name}</a>`

                create_delete_tag_btn(span)

                tags.insertBefore(span, add_btn)
            }
        }
        tags.appendChild(add_btn)

        inner_notes.contentEditable = true
        inner_notes.style.backgroundColor = "rgb(180, 178, 180)"
        focus_ce(inner_notes)
    } else {
        // save
        inner_notes.contentEditable = false
        inner_notes.style.backgroundColor = ""

        Array.from(tags.children).forEach(el => {
            if (el.children.length > 1) {
                el.children[1].remove()
            }
        })
        tags.children[tags.children.length - 1].remove()

        await fetch(`/articles/${articleID}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                notes: inner_notes.innerText,
                tags: Array.from(tags.children).map(el => el.innerText),
            }),
        })
    }
}

async function edit_tag(tagID) {
    close_add_tag()
    add_tag()
    window.old_tag = tagID
    document.getElementById("name").value = tagID
    const req = await fetch(`/tags/${tagID}`)
    const res = await req.json()
    document.getElementById("color").value = "#" + res.color
}
