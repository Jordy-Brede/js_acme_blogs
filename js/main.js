function createElemWithText(elementName = "p", textContent = "", className = "") {
 
    const element = document.createElement(elementName);

    element.textContent = textContent;
  
    if (className) {
        element.className = className;
    }

    return element;
}

function createSelectOptions(users) {
    
    if (!users) return undefined;
    const options = [];
    users.forEach(user => {
        const option = document.createElement("option");
        option.value = user.id;
        option.textContent = user.name;
        options.push(option);
    });

 
    return options;
}

function toggleCommentSection(postId) {
    if (postId === undefined || postId === null) {  return undefined;}
    const section = document.querySelector(`section[data-post-id="${postId}"]`);

    if (!section) {
        return null; 
    }
    section.classList.toggle("hide");

    return section;
}


function toggleCommentButton(postId) {  
    if (postId === undefined || postId === null) {
        return undefined;
    }
    const button = document.querySelector(`button[data-post-id="${postId}"]`);
    if (!button) {
        console.warn(`Button with data-post-id="${postId}" not found.`);
        return null;
    }
    button.textContent = button.textContent === 'Show Comments' 
        ? 'Hide Comments' 
        : 'Show Comments';

    return button;
}

function deleteChildElements(parentElement) {
 if (!parentElement || !(parentElement instanceof Element)) {
    return undefined;
}

  let child = parentElement.lastElementChild;
  while (child){
    parentElement.removeChild(child);
    child = parentElement.lastElementChild;
  }
  return parentElement;
}


//function handleButtonClick(event, postId) {
 //   toggleComments(event, postId);
//}





function addButtonListeners() {
    const buttons = document.querySelectorAll('main button');
    if (buttons.length > 0) {
        buttons.forEach(button => {
            const postId = button.dataset.postId;
            if (postId) {
                button.addEventListener('click', function(event) {
                    
                    toggleComments(event, postId);
                }); }});
}
  
    return buttons;
}


function removeButtonListeners() {
    const buttons = document.querySelectorAll('main button');
    buttons.forEach(button => {
        const postId = button.dataset.postId; 
        if (postId) {
            button.removeEventListener('click', event => toggleComments(event, postId));
        }});
    return buttons;
}



function createComments(commentsData) {
  if (commentsData === undefined || commentsData === null) {
        return undefined;
    }
    const fragment = document.createDocumentFragment();
    commentsData.forEach(comment => {
        const article = document.createElement('article');
        const h3 = createElemWithText('h3', comment.name);
        const pBody = createElemWithText('p', comment.body);
        const pEmail = createElemWithText('p', `From: ${comment.email}`);
        article.append(h3);
        article.append(pBody);
        article.append(pEmail);
        fragment.append(article);
    });
    return fragment;
}

function populateSelectMenu(usersData){
  if (usersData === undefined || usersData === null) {
        return undefined;
    }
  
    const selectMenu = document.getElementById('selectMenu');
    const options = createSelectOptions(usersData);
    if (Array.isArray(options)) {
        options.forEach(option => {
            selectMenu.appendChild(option);
        });}

    return selectMenu;
}


async function getUsers() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        const usersData = await response.json();
      
         return usersData;} 
  
        catch (error) {
        console.error(error);
    }
}

 async function getUserPosts(userId) {
    if (userId === undefined || userId === null) {
        return undefined;
    }
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
        const postsData = await response.json();
        return postsData;
    } 
   catch (error) {
        console.error(error);
    }
}


async function getUser(userId) {
    if (userId === undefined || userId === null) {
        return undefined; 
    }

    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);

        if (!response.ok) {
            throw new Error('Failed to fetch the user data');
        }

        const userData = await response.json();
        return userData; 
    } catch (error) {
        console.error(error);
        return null; 
    }
}


async function getPostComments(postId) {
    if (postId === undefined || postId === null) {
        return undefined;  
    }

    try {

       const response = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`);
        const commentsData = await response.json();
        
        return commentsData; 
    } catch (error) {
        console.error(error);
        return null; 
    }
}

async function displayComments(postId) {
    if (postId === undefined || postId === null) {
        return undefined; 
    }
        const section = document.createElement('section');
        section.dataset.postId = postId;
        section.classList.add('comments', 'hide');
      
        const comments = await getPostComments(postId);
        const fragment = createComments(comments);

        section.append(fragment);

        return section;
    } 


async function createPosts(posts) {
  if (posts === undefined || posts === null) {
        return undefined; 
    }
    const fragment = document.createDocumentFragment();

    for (const post of posts) {
        const article = document.createElement('article');
        const h2 = createElemWithText('h2', post.title);
        const pBody = createElemWithText('p', post.body);
        const pId = createElemWithText('p', `Post ID: ${post.id}`);
        const author = await getUser(post.userId);
        const pAuthor = createElemWithText('p', `Author: ${author.name} with ${author.company.name}`);
        const pCatchphrase = createElemWithText('p', 'Multi-layered client-server neural-net');
        const button = document.createElement('button');
        button.textContent = 'Show Comments';
        button.dataset.postId = post.id;

        article.append(h2);
        article.append(pBody);
        article.append(pId);
        article.append(pAuthor);
        article.append(pCatchphrase);
        article.append(button);


        const section = await displayComments(post.id);

        article.append(section);
        fragment.append(article);
    }

    return fragment;
}

async function displayPosts(posts) {
    const main = document.querySelector('main');
    const element = posts 
        ? await createPosts(posts) 
        : createElemWithText('p', 'Select an Employee to display their posts.', 'default-text');

    main.append(element);

    return element;
}


function toggleComments(event, postId) {
    if (!postId) {
        return undefined;
    }

    event.target.listener = true;
    const section = toggleCommentSection(postId);
    const button = toggleCommentButton(postId);
    return [section, button];
}

async function refreshPosts(posts) {
     if (!posts) {
        return undefined;
    }
    const removeButtons = removeButtonListeners();
    const mainElement = document.querySelector('main');
    const main = deleteChildElements(mainElement);
    const fragment = await displayPosts(posts);
    const addButtons = addButtonListeners();

    return [removeButtons, main, fragment, addButtons];
}


async function selectMenuChangeEventHandler(event) {
       if (!event || event.type !== 'change') return;
  
    const userId = event.target.value || 1;
    const selectMenu = event.target;
    selectMenu.disabled = true;
    const posts = await getUserPosts(userId);
    const refreshPostsArray = await refreshPosts(posts);
  
    selectMenu.disabled = false;

    return [userId, posts, refreshPostsArray];

async function selectMenuChangeEventHandler(event) {
    if (!event || event.type !== 'change') return;

   
    const selectMenu = event.target;
    selectMenu.disabled = true;
    const userId = parseInt(selectMenu.value) || 1;
    const posts = await getUserPosts(userId);
    const refreshPostsArray = await refreshPosts(posts);
    selectMenu.disabled = false;
    return [userId, posts, refreshPostsArray];
}


  

async function initPage() {
    const users = await getUsers();
    const select = populateSelectMenu(users);
    return [users, select];
}

function initApp() {
    initPage().then(([users, select]) => {
        const selectMenu = document.getElementById('selectMenu');
        selectMenu.addEventListener('change', selectMenuChangeEventHandler);
    });
}
document.addEventListener('DOMContentLoaded', initApp);
}