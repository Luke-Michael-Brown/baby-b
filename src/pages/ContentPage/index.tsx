import React from 'react'
import Footer from '../../components/Footer'
import SecondaryBar from '../../components/SecondaryBar'
import TabContent from '../../components/TabContent'

function ContentPage() {
  return (
    <>
      <SecondaryBar />
      <TabContent />
      <Footer />
    </>
  )
}

export default React.memo(ContentPage)
