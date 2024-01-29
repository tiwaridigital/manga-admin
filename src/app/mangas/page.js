import React from 'react'
import fetchAllMangas from '@/lib/fetchAllMangas'
import MangasTable from "@/app/components/mangasTable/MangasTable";
import Layout from "@/app/layout/Layout";

const page = async () => {
  const mangas = await fetchAllMangas()
  console.log('mangas', mangas)
  return (
      <Layout>
        <MangasTable mangas={mangas} />
      </Layout>
  )
}

export default page