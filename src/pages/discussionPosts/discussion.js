import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';

export default function App() {
  //
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  //
  const [mealPlans, setMealPlans] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedMealPlan, setSelectedMealPlan] = useState(null);
  //
  const [selectedPost, setSelectedPost] = useState(null);
  const [parsedSelectedPost, setParsedSelectedPost] = useState(null);
  const [showMealPlanModal, setShowMealPlanModal] = useState(false);
  //
  const [replyInputs, setReplyInputs] = useState({});
  const [activeReplyPostId, setActiveReplyPostId] = useState(null);
  //
  const [replies, setReplies] = useState({});
  // New ones for creating a meal plan
  const [newMealPlan, setNewMealPlan] = useState({
    title: '',
    description: '',
    instructions: '',
    ingredients: '',
    calories: '',
    fat: '',
    sugar: '',
    image: null,
  });
  //
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;
  const user_type = user ? user.user_type : null;
  const user_id = user ? user.user_id : null;
  //
  const [isDoctor, setIsDoctor] = useState(false);
  const [isPatient, setIsPatient] = useState(false);

  useEffect(() => {
    fetchPosts();
    // Bootleg ass statments
    if(user_type === "doctor"){
      setIsDoctor(true);
    }
  }, []);

  const fetchPosts = async () => {
    console.log("Test user: ", user_type, " user_id: ", user_id)
    try {
        const response = await fetch('http://localhost:5000/api/discussion/posts', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        if (response.ok) {
          const data = await response.json();
          console.log("Data:", data)
          // , ", title: ", data[0].post_title, ", content: ", data[0].post_content
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

  const fetchMealPlans = async () => {
    try {
      const response = await fetch(`http://localhost:5000/doctor-dashboard/official/all?user_id=${user_id}`);
      if (response.ok) {
        const data = await response.json();
        setMealPlans(data.mealplans);
      } else {
        console.error('Failed to fetch meal plans');
      }
    } catch (error) {
      console.error('Error fetching meal plans:', error.message);
    }
  };

  const handleCreateMealPlan = async () => {
    try {
      const formData = new FormData();
      formData.append('user_id', user_id);
      formData.append('title', newMealPlan.title);
      formData.append('description', newMealPlan.description);
      formData.append('instructions', newMealPlan.instructions);
      formData.append('ingredients', newMealPlan.ingredients);
      formData.append('calories', newMealPlan.calories);
      formData.append('fat', newMealPlan.fat);
      formData.append('sugar', newMealPlan.sugar);
      if (newMealPlan.image) {
        formData.append('image', newMealPlan.image);
      }
  
      const response = await fetch('http://localhost:5000/doctor-dashboard/official/create', {
        method: 'POST',
        body: formData,
      });
  
      if (response.ok) {
        console.log('Meal plan created successfully!');
        setShowCreateModal(false);
        fetchPosts();
      } else {
        console.error('Failed to create meal plan');
      }
    } catch (error) {
      console.error('Error creating meal plan:', error.message);
    }
  };

  const handleUploadMealPlan = async () => {
    if (!selectedMealPlan) return;
  
    try {
      // Create a full object instead of just { contents: description }
      const myContent = {
        description: selectedMealPlan.description,
        instructions: selectedMealPlan.instructions,
        ingredients: selectedMealPlan.ingredients,
        calories: selectedMealPlan.calories,
        fat: selectedMealPlan.fat,
        sugar: selectedMealPlan.sugar,
        image: selectedMealPlan.image, // if image exists
      };
  
      const requestData = {
        doctor_id: user_id - 1,
        post_title: selectedMealPlan.title,
        post_content: myContent, // now sending full meal plan info
      };
  
      const response = await fetch('http://localhost:5000/api/discussion/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
  
      if (response.ok) {
        console.log('Meal plan uploaded as post!');
        setShowUploadModal(false);
        fetchPosts();
      } else {
        console.error('Failed to upload meal plan');
      }
    } catch (error) {
      console.error('Error uploading meal plan:', error.message);
    }
  };

  const handlePostClick = (post) => {
    setSelectedPost(post);
    setParsedSelectedPost(JSON.parse(post.post_content));
    //console.log("Post: ", parsedSelectedPost, "Title?: ", parsedSelectedPost.post_title)
    setShowMealPlanModal(true);
    console.log("POST CLICKED")
  };

  const handleReplyChange = (postId, value) => {
    setReplyInputs(prev => ({ ...prev, [postId]: value }));
  };
  
  const submitReply = async (postId) => {
    const replyContent = replyInputs[postId];
    if (!replyContent || replyContent.trim() === "") return;
  
    try {
      const response = await fetch('http://localhost:5000/api/discussion/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          post_id: postId,
          patient_id: user_id, // make sure `user_id` is the current patient
          reply_content: replyContent,
        }),
      });
  
      if (response.ok) {
        console.log("✅ Reply submitted!");
        setReplyInputs(prev => ({ ...prev, [postId]: '' }));
        setActiveReplyPostId(null);
        // optionally refetch replies or show success
      } else {
        console.error("❌ Failed to submit reply");
      }
    } catch (err) {
      console.error("Error submitting reply:", err.message);
    }
  };

  const fetchReplies = async (postId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/discussion/replies/${postId}`);
      if (response.ok) {
        const data = await response.json();
        setReplies(prev => ({ ...prev, [postId]: data }));
      } else {
        console.error("Failed to fetch replies");
      }
    } catch (error) {
      console.error("Error fetching replies:", error);
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
          {filteredPosts.map(post => {
            let parsedContent = {};
            try {
              parsedContent = JSON.parse(post.post_content);
              //console.log("Post Desc?: ", post.post_content.description);
            } catch (e) {
              console.error("Failed to parse post_content for post", post, e);
            }

            return (
              <div
                key={post.post_id}
                className="bg-white p-6 rounded-xl shadow-md w-[600px] mx-auto relative"
                onClick={() => handlePostClick(post)}
              >
                <h2 className="font-bold mb-2">{post.post_title}</h2>
                <p className="text-gray-800 whitespace-pre-line mb-4">
                  {parsedContent.description
                    ? parsedContent.description.substring(0, 100) + '...'
                    : "No description available."}
                </p>
                
                {/* Reply button */}
                <div className="flex justify-end">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const isOpening = post.post_id !== activeReplyPostId;
                      setActiveReplyPostId(isOpening ? post.post_id : null);
                      if (isOpening) {
                        fetchReplies(post.post_id);
                      }
                    }}
                    className="text-blue-600 font-medium hover:underline"
                  >
                    {activeReplyPostId === post.post_id ? "Cancel" : "Reply"}
                  </button>
                </div>

                {/* Reply input field */}
                {activeReplyPostId === post.post_id && (
                  <div className="mt-3">
                    <textarea
                      className="w-full border p-2 rounded"
                      rows="3"
                      placeholder="Write your reply..."
                      value={replyInputs[post.post_id] || ''}
                      onChange={(e) => handleReplyChange(post.post_id, e.target.value)}
                      onClick={(e) => e.stopPropagation()} // ✅ Prevent click bubbling here too
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // ✅ Prevent post detail opening
                        submitReply(post.post_id);
                      }}
                      className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                    >
                      Submit Reply
                    </button>
                  </div>
                )}

                {/* Reply view */}
                {activeReplyPostId === post.post_id && (
                  <div className="mt-4">
                    {/* Reply input (already added earlier) */}

                    {/* Submitted replies */}
                    {replies[post.post_id] && replies[post.post_id].length > 0 ? (
                      <div className="mt-4 space-y-2">
                        <h3 className="font-semibold text-gray-700">Replies:</h3>
                        {replies[post.post_id].map(reply => (
                          <div key={reply.reply_id} className="bg-gray-100 p-2 rounded text-sm">
                            {reply.reply_content}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 mt-2">No replies yet.</p>
                    )}
                  </div>
                )}

              </div>
            );
          })}
        </div>
      </main>
      
      {isDoctor && (
        <button
          onClick={() => setShowForm(true)}
          className="fixed bottom-10 right-10 flex flex-col items-center text-center"
        >
          <div className="w-16 h-16 flex items-center justify-center rounded-full border border-black text-black text-3xl bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full shadow-lg transition transform hover:scale-105">
            <Plus size={32} />
          </div>
          <span className="mt-2">Add post</span>
        </button>
      )}
      
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-lg w-96 flex flex-col space-y-4">
            <button
              onClick={() => {
                fetchMealPlans();
                setShowForm(false);
                setShowUploadModal(true);
              }}
              className="px-4 py-2 bg-green-500 text-white rounded"
            >
              Upload Existing Meal Plan
            </button>
            <button
              onClick={() => {
                setShowForm(false);
                setShowCreateModal(true);
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Create New Meal Plan
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Select a Meal Plan to Upload</h2>
            <ul className="space-y-3 max-h-60 overflow-y-auto">
              {mealPlans.map(plan => (
                <li
                  key={plan.meal_plan_id}
                  className="cursor-pointer hover:bg-gray-100 p-2 rounded"
                  onClick={() => setSelectedMealPlan(plan)}
                >
                  {plan.title}
                </li>
              ))}
            </ul>
            <div className="flex justify-end mt-6 space-x-2">
              <button
                className="bg-green-500 text-white py-2 px-4 rounded"
                onClick={handleUploadMealPlan}
                disabled={!selectedMealPlan}
              >
                Upload
              </button>
              <button
                className="bg-gray-300 py-2 px-4 rounded"
                onClick={() => setShowUploadModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-[500px]">
            <h2 className="text-xl font-bold mb-4">Create New Meal Plan</h2>
            <div className="space-y-4">
              <input type="text" placeholder="Title" className="w-full p-2 border rounded" value={newMealPlan.title} onChange={e => setNewMealPlan({ ...newMealPlan, title: e.target.value })} />
              <textarea placeholder="Description" className="w-full p-2 border rounded" value={newMealPlan.description} onChange={e => setNewMealPlan({ ...newMealPlan, description: e.target.value })} />
              <textarea placeholder="Instructions" className="w-full p-2 border rounded" value={newMealPlan.instructions} onChange={e => setNewMealPlan({ ...newMealPlan, instructions: e.target.value })} />
              <textarea placeholder="Ingredients" className="w-full p-2 border rounded" value={newMealPlan.ingredients} onChange={e => setNewMealPlan({ ...newMealPlan, ingredients: e.target.value })} />
              <input type="number" placeholder="Calories" className="w-full p-2 border rounded" value={newMealPlan.calories} onChange={e => setNewMealPlan({ ...newMealPlan, calories: e.target.value })} />
              <input type="number" placeholder="Fat" className="w-full p-2 border rounded" value={newMealPlan.fat} onChange={e => setNewMealPlan({ ...newMealPlan, fat: e.target.value })} />
              <input type="number" placeholder="Sugar" className="w-full p-2 border rounded" value={newMealPlan.sugar} onChange={e => setNewMealPlan({ ...newMealPlan, sugar: e.target.value })} />
              <input type="file" accept="image/*" onChange={e => setNewMealPlan({ ...newMealPlan, image: e.target.files[0] })} />

              <div className="flex justify-end space-x-2">
                <button className="px-4 py-2 bg-gray-300 rounded" onClick={() => setShowCreateModal(false)}>Cancel</button>
                <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={handleCreateMealPlan}>Create</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showMealPlanModal && selectedPost && parsedSelectedPost && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-[600px] max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setShowMealPlanModal(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
            >
              ✖
            </button>

            <h2 className="text-2xl font-bold mb-4">{selectedPost.post_title}:</h2>
            
            {parsedSelectedPost.image && (
              <img
                src={`http://localhost:5000/static/${parsedSelectedPost.image}`}
                alt="Meal Plan"
                className="w-full h-64 object-cover rounded mb-4"
              />
            )}

            <p className="mb-4"><strong>Description:</strong> {parsedSelectedPost.description}</p>

            {parsedSelectedPost.ingredients && (
              <>
                <h3 className="text-lg font-semibold">Ingredients</h3>
                <p className="mb-4">{parsedSelectedPost.ingredients}</p>
              </>
            )}
            
            {parsedSelectedPost.instructions && (
              <>
                <h3 className="text-lg font-semibold">Instructions</h3>
                <p className="mb-4">{parsedSelectedPost.instructions}</p>
              </>
            )}
            
            <div className="grid grid-cols-3 gap-4">
              <div><strong>Calories:</strong> {parsedSelectedPost.calories}</div>
              <div><strong>Fat:</strong> {parsedSelectedPost.fat}g</div>
              <div><strong>Sugar:</strong> {parsedSelectedPost.sugar}g</div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
