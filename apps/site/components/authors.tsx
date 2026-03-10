type Author = {
    name: string
}
let authors: Record<string, Author> = {
    "foo": {
        name: "foo name"
    },
    "bar": {
        name: "bar name"
    },
}

function get(id: string) {
    return authors[id];
}

function Author({id}: { id: string }) {
    const author = get(id);
    let name = author ? author.name : "Unknown"
    return <span>By: {name}</span>;
}

export function Authors() {
    let mapEntry = Object.entries(authors);
    return (
        <>
            {
                mapEntry.map(([id, _]) => {
                    return <Author id={id}/>
                })
            }
        </>
    )

}
