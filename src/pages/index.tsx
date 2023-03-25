import { trpc } from '@/utils/trpc'
import { Post } from '@/types/post';
import { useState } from 'react';

const ListItem = ({post}: {post: Post}) => {
  return (
    <tr key={post.id} className={`${post.id % 2 === 1 ? 'bg-gray-200' : null}`}>
        <td className='px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-800'>{post.title}</td>
        <td className='px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-800'>{post.description}</td>
        <td className='px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-800'>{post.author}</td>
        <td className='px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-800'>{post.createdAt.toLocaleString()}</td>
    </tr>
  )
}

type alertProps = {
  error: any;
  type: string;
}
const Alert = ({error, type}: alertProps) => {
  if(error === ""){
    return null
  }
  return (
    <div className={`rounded-lg ${type === 'error' ? "bg-red-500" : null} text-white p-2`}>
        <p>{error['message']}</p>
      </div>
  )
}

export default function Home() {
  const utils = trpc.useContext()
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [author, setAuthor] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const allPost = trpc.post.all.useQuery(undefined, {
    staleTime: 3000,
  })

  const submitPost = () => {
    addPost.mutate({title, description, author})
  }

  const addPost = trpc.post.add.useMutation({
    async onMutate() {
      await utils.post.all.cancel();
    },

    async onError(error) {
      console.log('error: ',error.data)
      setErrorMessage(error.message)
    },
    
    async onSuccess({title, description, author}) {
      const post = allPost.data ?? [];
      
      utils.post.all.setData(undefined, [
        ...post, 
        {
          id: Math.random(),
          title, 
          description, 
          author,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ]
      )
    }
  });

  return (
    <div>
      <Alert
        error={errorMessage}
        type={'error'}
      />
      <h1 className='text-center my-5 font-semibold text-2xl'>create new post</h1>
      <div className='container w-1/2 mx-auto'>
      <div className='flex flex-col gap-4 mb-3'>
        <label className='font-bold text-lg'>Title</label>
        <input onChange={(e) => setTitle(e.target.value)} className="border p-2 rounded-lg" type={'text'} placeholder={"title here..."} />
      </div>
      <div className='flex flex-col gap-4 mb-3'>
        <label className='font-bold text-lg'>description</label>
        <textarea onChange={(e) => setDescription(e.target.value)} className="border p-2 rounded-lg" placeholder={"description here..."}></textarea>
      </div>
      <div className='flex flex-col gap-4'>
        <label className='font-bold text-lg'>author</label>
        <input onChange={(e) => setAuthor(e.target.value)} className="border p-2 rounded-lg" type={'text'} placeholder={"author here..."} />
      </div>
      <div className='text-center'>
      <button onClick={submitPost} className='bg-green-400 text-white p-3 rounded-lg mt-3 active:bg-green-600'>Post now</button>
      </div>
      </div>
      <h1 className='text-center my-5 font-semibold text-2xl'>list post</h1>
      <table className="table-auto mx-auto mt-5 border">
        <thead className='border'>
        <tr>
          <th className="px-4 py-3.5 text-sm font-bold text-center rtl:text-right text-gray-800">Title</th>
          <th className="px-4 py-3.5 text-sm font-bold text-center rtl:text-right text-gray-800">Description</th>
          <th className="px-4 py-3.5 text-sm font-bold text-center rtl:text-right text-gray-800">Author</th>
          <th className="px-4 py-3.5 text-sm font-bold text-center rtl:text-right text-gray-800">Created At</th>
        </tr>
        </thead>
        <tbody>
        {
            allPost.data?.map((data) => {
                return (
                  <ListItem post={data} key={data.id} />
                )
            })
          }
        </tbody>
      </table>
    </div>
  )
};
