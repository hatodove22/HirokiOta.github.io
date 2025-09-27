import React from 'react'

export class ErrorBoundary extends React.Component<React.PropsWithChildren, {error?: Error}> {
  constructor(props: any) {
    super(props)
    this.state = { error: undefined }
  }
  static getDerivedStateFromError(error: Error) { return { error } }
  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // ログ収集（開発用）
    console.error('[EditMode] ErrorBoundary', error?.message, info?.componentStack)
  }
  render() {
    if (this.state.error) {
      return (
        <div className="p-6">
          <h2 className="text-red-600 font-semibold">エラーが発生しました</h2>
          <pre className="mt-2 text-sm whitespace-pre-wrap">{String(this.state.error?.message || this.state.error)}</pre>
        </div>
      )
    }
    return this.props.children as any
  }
}
