import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getFirestore, collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyC5aEYP-0apyUKj7gEGLKhoHgfTGArsXb8",
    authDomain: "iboard-8d2b9.firebaseapp.com",
    projectId: "iboard-8d2b9",
    storageBucket: "iboard-8d2b9.firebasestorage.app",
    messagingSenderId: "556440664769",
    appId: "1:556440664769:web:4706332cb781ff7fecf240",
    measurementId: "G-856J2J72R3"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const blogContainer = document.getElementById('blog');

/**
 * Converts a Firestore timestamp to a readable date string.
 * @param {object} firestoreTimestamp - The timestamp object from Firestore.
 * @returns {string} The formatted date string.
 */
function formatDate(firestoreTimestamp) {
    if (!firestoreTimestamp || !firestoreTimestamp.seconds) return 'Unknown Date';
    const date = new Date(firestoreTimestamp.seconds * 1000);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

async function loadBlogPosts() {
    blogContainer.innerHTML = '<h2>Loading Blog Posts...</h2>';
    try {
        const q = query(collection(db, "blogs"), orderBy("timestamp", "desc"));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            blogContainer.innerHTML = '<p>No blog posts published yet!</p>';
            return;
        }

        blogContainer.innerHTML = '';

        querySnapshot.forEach((doc) => {
            const post = doc.data();
            const postElement = document.createElement('div');
            postElement.className = 'blog-post';

            const progressHtml = `
                <div class="progress-bar-container">
                    <strong>Quadruped Progress:</strong> ${post.progress.quadruped}%
                    <div class="progress" style="height: 15px; margin-bottom: 10px;">
                        <div class="progress-bar" style="width: ${post.progress.quadruped}%; background-color: #28a745;"></div>
                    </div>
                    <strong>Speedy Team Progress:</strong> ${post.progress.speedy}%
                    <div class="progress" style="height: 15px;">
                        <div class="progress-bar" style="width: ${post.progress.speedy}%; background-color: #007bff;"></div>
                    </div>
                </div>
            `;
            
            postElement.innerHTML = `
                <div class="post-header">
                    <h2>${post.title}</h2>
                    <p class="post-meta">
                        By <strong>${post.author}</strong> on ${formatDate(post.timestamp)}
                    </p>
                </div>
                <div class="post-content">
                    ${post.content}
                </div>
                ${progressHtml}
                <hr>
            `;
            blogContainer.appendChild(postElement);
        });

    } catch (e) {
        console.error("Error loading blog posts: ", e);
        blogContainer.innerHTML = '<p style="color: red;">Error fetching blog posts. Check console for details.</p>';
    }
}

loadBlogPosts();