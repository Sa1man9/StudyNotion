import React, { useEffect, useState } from 'react'
import CourseSlider from '../components/core/Catalog/CourseSlider'
import { useParams } from 'react-router-dom'
import { apiConnector } from '../services/apiConnector';
import { categories } from '../services/apis';
import { useDispatch } from 'react-redux';
import { getCatalogPageData } from '../services/operations/pageAndComponentData';

const Catalog = () => {
    const catalogName=useParams();
    const [catalogPageData,setCatalogPageData]=useState(null)
    const [categoryId,setCategoryId]=useState(null)
    const [desc,setDesc]=useState([]);
    const [activeOption, setActiveOption]=useState(1);
    const dispatch=useDispatch()

    useEffect(()=>{
        const getCategories = async() => {
            const res = await apiConnector("GET", categories.CATEGORIES_API);
            const category_id = res?.data?.data?.filter((ct) => ct.name.split(" ").join("-").toLowerCase() === catalogName)[0]._id;
            setCategoryId(category_id);
        }
        getCategories();
    },[catalogName])

    useEffect(()=>{
        const fetchCatalogPageData= async ()=>{
            const result = await getCatalogPageData(categoryId)
            console.log(result)
            setCatalogPageData(result)
        }
        if(categoryId){
            fetchCatalogPageData()
        }
    },[categoryId])

  return (
    <div>
      <div className=' box-content bg-richblack-800 px-4'>
            <div className='mx-auto flex min-h-[260px]  flex-col justify-center gap-4 '>
                <p className='text-sm text-richblack-300'>Home / Catalog / <span className='text-yellow-25'>{catalogName?.catalog}</span></p>
                <p className=' text-3xl text-richblack-5'>{catalogName?.catalog}</p>
                <p className='max-w-[870px] text-richblack-200'>
                    {/* {desc?.description} */}
                </p>
            </div>
      </div>

      <div className=' mx-auto box-content w-full max-w-maxContentTab px-2 py-12 lg:max-w-maxContent'>
            <h2 className='Courses to get you started'>
                Courses to get you started
            </h2>
            <div className='my-4 flex border-b border-b-richblack-600 text-sm'>
                <button onClick={()=>{setActiveOption(1)}}  className={activeOption===1? `px-4 py-2 border-b border-b-yellow-25 text-yellow-25 cursor-pointer`:`px-4 py-2 text-richblack-50 cursor-pointer` }>Most Popular</button>
                <button onClick={()=>{setActiveOption(2)}} className={activeOption===1?'px-4 py-2 text-richblack-50 cursor-pointer':'px-4 py-2 border-b border-b-yellow-25 text-yellow-25 cursor-pointer'}>New </button>
            </div>
            <CourseSlider/>
      </div>

      <div className=' mx-auto box-content w-full max-w-maxContentTab px-2 py-12 lg:max-w-maxContent'>
            <h2 className='section_heading mb-6 md:text-3xl text-xl'>
                Frequently BoughtTogether
            </h2>
            <div className='grid grid-cols-2 gap-3 lg:gap-6 lg:grid-cols-2 pr-4'>

            </div>
      </div>
    </div>
  )
}

export default Catalog
