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
  // NOTE: loads *after* Note,
  // but is fast if data is co-located.
  const author = get(id);
  return <span>By: {author.name}</span>;
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
