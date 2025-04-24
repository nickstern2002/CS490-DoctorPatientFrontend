import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';

export default function App() {
  //
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [showForm, setShowForm] = useState(false);
  //
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;
  const user_type = user ? user.user_type : null;
  const user_id = user ? user.user_id : null;

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    console.log("Test user: ", user_type)
    try {
        const response = await fetch('http://localhost:5000/api/discussion/posts', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        if (response.ok) {
          const data = await response.json();
          console.log("Data:", data, ", title: ", data[0].post_title, ", content: ", data[0].post_content)

          setPosts(data)
        } 
        else {
          const data = await response.json();
          console.log("Data but went wrong:", data)
          //setError(data.error)
          //setTimeout(() => setError(""), 10000); // Hide message after 10 seconds
        }
      } 
      catch (error) {
        console.log('Error: ' + error.message);
        //setError('Error: ' + error.message);
        //setTimeout(() => setError(""), 10000); // Hide message after 10 seconds
      }
  };

  const handleAddPost = async () => {
      try {
        console.log("id?", user_id)
        const myContent = {"contents": content};
        // Replace user id with the doctor id. doctor id != user id
        const requestData = {
            doctor_id: (user_id-1),
            post_title: title,
            post_content: myContent
        }
        const response = await fetch('http://localhost:5000/api/discussion/post', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData), // Convert the data to JSON
        });
        // close enough for now
        if (response.ok) {
          //alert('Login Successful');
          const data = await response.json();
          console.log("Data:", data)
          fetchPosts()
          setShowForm(false)
          
        } 
        else {
          const data = await response.json();
          console.log("Data but went wrong:", data)
          //alert("Data but went wrong:", data)
          //setError(data.error)
          //setTimeout(() => setError(""), 10000); // Hide message after 10 seconds
        }
      } 
      catch (error) {
        //setMessage('Error: ' + error.message); 
        console.log('Error: ' + error.message);
        //alert('Error: ' + error.message);
        //setError('Error: ' + error.message);
        //setTimeout(() => setError(""), 10000); // Hide message after 10 seconds
      }
  };

  const filteredPosts = posts.filter(post =>
    post.post_title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen flex bg-white">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r shadow-md flex flex-col p-4 rounded-tr-[40px] rounded-br-[40px]">
        <label className="font-semibold mb-2">Search:</label>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title"
          className="p-2 border border-gray-300 rounded"
        />
      </aside>

      {/* Main content */}
      <main className="flex-1 p-10 bg-[#d8eafe]">
        <h1 className="text-2xl font-semibold text-center mb-6">Discussion Posts</h1>
        <div className="space-y-6">
        {filteredPosts.map(post => (
        <div key={post.post_id} className="border border-black p-6 w-[600px] mx-auto">
            <h2 className="font-bold mb-2">{post.post_title}</h2>
            <p className="text-gray-800 whitespace-pre-line mb-4">
            {JSON.parse(post.post_content).contents}
            </p>
            <div className="text-right text-sm text-blue-500 cursor-pointer">Reply</div>
        </div>
        ))}
        </div>
      </main>

      {/* Add post button */}
      <button
        onClick={() => setShowForm(!showForm)}
        className="fixed bottom-10 right-10 flex flex-col items-center text-center"
      >
        <div className="w-16 h-16 flex items-center justify-center rounded-full border border-black text-black text-3xl">
          <Plus size={32} />
        </div>
        <span className="mt-2">Add post</span>
      </button>

      {/* Add Post Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Add a new post</h2>
            <div className="space-y-4">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                required
                className="w-full p-2 border rounded"
              />
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Diet Content Goes Here"
                required
                className="w-full p-2 border rounded"
              />
              <div className="flex justify-end space-x-2">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded"onClick={handleAddPost}>Post</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
