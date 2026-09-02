import { Brain, ChevronRight, Dot, MousePointer2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useSkill } from '../hooks/useSkill'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router'

const Skill = () => {

  const { handleGetTopicsByCategory, handleSetSelectedTopic, handleGetQuestions } = useSkill()

  const categories = [
    {
      name: 'Aptitude',
      score: 10
    },
    {
      name: 'Reasoning',
      score: 20
    },
    {
      name: 'Verbal',
      score: 40
    },
    {
      name: 'Technical',
      score: 100
    }
  ]
  const [selectedCat, setSelectedCat] = useState(0)
  const [selectedTopicIndex, setSelectedTopicIndex] = useState(null)

  const navigate = useNavigate()

  useEffect(() => {
    handleGetTopicsByCategory(categories[selectedCat].name)
  }, [selectedCat])

  const topics = useSelector((state) => state.skill.topics)
  const selectedTopic = useSelector((state) => state.skill.selectedTopic)
  const questions = useSelector((state) => state.skill.questions)
  console.log("Question check", questions);


  return (
    <main className='flex min-h-screen flex-col justify-center px-10 py-6'>
      <section className='max-h-1/4 flex flex-col justify-center items-center gap-4 pt-5'>
        <h1 className='text-[14px] sm:text-xl lg:text-3xl font-bold'>Build Skills That Get You Hired</h1>
        <p className='text-[11px] md:text-base lg:text-lg text-slate-500'>Identify your weak topics, practice with purpose, and turn every gap into an opportunity to improve.</p>
      </section>
      <section className=' max-h-1/2 flex flex-col md:flex-row lg:flex-row justify-evenly items-center gap-10 p-5'>
        <div className='h-full flex flex-col justify-center items-center gap-3 '>
          <div className='relative h-40 w-40 shrink-0 overflow-hidden   rounded-full justify-center items-center flex'>
            <div className='goToBigCircle z-20 h-3 w-3 shrink-0 bg-transparent border border-black/20 rounded-full'></div>
            <div className='absolute inset-0 z-10 flex items-center justify-center '>
              <h2 className='text-2xl '>100%</h2>
            </div>
          </div>
          <h2>Your Progress</h2>
        </div>
        <div className='w-full h-50 bg-mist-200 rounded-2xl flex flex-col justify-center items-center'>
          {
            categories.map((category, index) => {
              return <div key={index} className='w-full px-6 py-2 flex justify-between items-center'>
                <div className='w-1/3'>
                  <h2 className='font-semibold'>{category.name}</h2>
                </div>
                <div className='w-full flex justify-center items-center gap-4'>
                  <h2>{category.score}%</h2>
                  <div className='w-full h-3 border border-black/20'>
                    <div
                      style={{ width: `${category.score}%` }}
                      className={`h-full bg-linear-90 from-red-600 to-orange-500`}></div>
                  </div>
                </div>
              </div>
            })
          }
        </div>
      </section>
      <section className='max-h-1/2 h-full border border-black/20 rounded-2xl flex flex-col justify-center items-start gap-4 p-5'>
        <div className='flex flex-col md:flex-row lg:flex-row w-full gap-5 justify-between items-center'>
          <h3 className='font-semibold  text-md uppercase'>All Topics From <span className='text-red-500'>{categories[selectedCat].name}</span></h3>
          <div className='flex gap-3 w-fit px-10'>
            {
              categories.map((category, index) => {
                return <button
                  key={index}
                  onClick={() => {
                    setSelectedCat(index)
                    handleGetTopicsByCategory(category.name)
                    handleSetSelectedTopic(null)
                    setSelectedTopicIndex(null)
                  }}
                  className={`hover:text-orange-500 cursor-pointer ${selectedCat == index ? 'text-orange-700' : ''}`}>
                  <h3 className='font-semibold text-[12px] uppercase'>{category.name}</h3>
                </button>
              })
            }
          </div>
        </div>
        <div className='h-full md:h-60 lg:h-60 w-full flex flex-col md:flex-row lg:flex-row justify-center gap-2 items-center '>
          <div className='w-full md:w-1/2 lg:w-1/2 h-60 md:h-full lg:h-full flex flex-col justify-center items-center'>
            <div className='text-center bg-white/10 backdrop-blur-2xl w-full'>
              <p className='text-[14px] font-semibold tracking-wider text-black'>TOPIC's</p>
            </div>
            <div className='h-full w-full bg-linear-90 from-amber-950 via-amber-900 to-zinc-900 rounded-2xl overflow-y-scroll'>
              {
                topics.map((topic, index) => {
                  return <div
                    key={index}
                    onClick={() => {
                      handleSetSelectedTopic(topic)
                      handleGetQuestions(topic)
                      setSelectedTopicIndex(index)
                    }}
                    className='px-4 py-2 flex justify-between items-center cursor-pointer text-white border-b border-white/10'
                  >
                    <p className={`${selectedTopicIndex == index ? 'text-cyan-400 tracking-widest transition-all ease-in duration-200' : ''}`}>{topic}</p>
                    <div className='flex justify-between items-center gap-2 text-[12px]'>
                      <ChevronRight className={`${selectedTopicIndex == index ? 'text-cyan-400 transition-all ease-in duration-200' : ''}`} />

                    </div>
                  </div>
                })
              }
            </div>
          </div>
          <div className='h-60 md:h-full lg:h-full w-full md:w-1/2 lg:w-1/2 flex flex-col justify-center items-center'>
            <div className='text-center bg-white/10 backdrop-blur-2xl w-full'>
              <p className='text-[14px] font-semibold tracking-wider text-black'>QUESTION's</p>
            </div>
            <div className='relative h-full w-full bg-amber-950 rounded-2xl overflow-y-scroll text-white'>
              {
                selectedTopic ? <div className='w-full h-full flex flex-col px-5 py-2'>
                  <div className='w-full flex flex-col justify-between items-center' >
                    <h2 className='font-semibold text-md tracking-wider uppercase'>{selectedTopic}</h2>
                    <div className='flex w-full justify-evenly items-center'>
                      <p className='text-[14px]'>Total : {questions.length}</p>

                    </div>
                    <div className='h-full mt-2 w-full flex flex-wrap gap-2'>
                      {
                        questions.map((question, index) => {
                          return <div
                            key={index}
                            onClick={()=>{
                              navigate(`/skill-building/${question._id}`)
                            }}
                            className='px-4 py-2  text-center bg-black/10 border border-white/40 backdrop-blur-2xl cursor-pointer rounded-2xl '
                          >
                            <h2>{index + 1}</h2>
                          </div>
                        })
                      }
                    </div>

                  </div>
                </div> : <div className='h-full w-full flex flex-col items-center justify-center'>
                  <Brain />
                  <p className='text-center'>Please select a topic to start practice</p>
                </div>
              }
            </div>
          </div>
        </div>

      </section>
    </main>
  )
}

export default Skill
