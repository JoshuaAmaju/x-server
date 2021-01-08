const createPost = (id: number, body: string) => {
  return {
    body,
    author: "Joshua",
    id: id.toString(),
    title: "Post by Joshua " + id,
    createdAt: new Date().toDateString(),
  };
};

let posts = new Array(30).fill(0).map((_, id) => {
  return createPost(
    id,
    `Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dicta nemo distinctio 
    dolorum quo vero perspiciatis facere illum mollitia, iure recusandae saepe possimus 
    voluptatem nostrum, natus fuga magnam numquam, repellendus blanditiis!`
  );
});

const findPost = (id: string) => {
  return posts.find((post) => post.id === id);
};

export function getAll() {
  return Promise.resolve(posts);
}

export function getOne(id: string) {
  return Promise.resolve(findPost(id));
}

export function create(body: any) {
  const post = createPost(posts.length, body);
  posts.push(post);
  return Promise.resolve(post);
}

export function updateOne(id: string, body: any) {
  const post = findPost(id);

  if (post) {
    post.body = body;
    posts[parseInt(id)] = post;
  }

  return Promise.resolve(post);
}

export function deleteOne(id: string) {
  posts.splice(parseInt(id), 1);
  return Promise.resolve();
}

export function deleteAll() {
  posts = [];
  return Promise.resolve();
}
