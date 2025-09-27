import React from 'react'

export function EditProtoPage() {
  const src = 'http://localhost:5174'
  return (
    <div className="w-full h-[calc(100vh-64px)]">
      <iframe src={src} title="Editor Proto" className="w-full h-full border-0" />
    </div>
  )
}
