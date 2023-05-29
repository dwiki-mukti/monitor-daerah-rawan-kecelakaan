import React from 'react'

export default function Test() {
    return (
        <>
            <div>NEXT_PUBLIC_API_URL: {process.env.NEXT_PUBLIC_API_URL}</div>
            <div>NEXT_PUBLIC_GMAPS_API_KEY: {process.env.NEXT_PUBLIC_GMAPS_API_KEY}</div>
        </>
    )
}
