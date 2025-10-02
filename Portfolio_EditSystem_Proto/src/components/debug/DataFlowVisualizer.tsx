import React, { useState, useEffect } from 'react';

interface DataFlowStep {
  id: string;
  name: string;
  status: 'pending' | 'processing' | 'success' | 'error';
  input?: string;
  output?: string;
  timestamp: string;
  duration?: number;
  error?: string;
}

interface DataFlowVisualizerProps {
  editorContent?: string;
  previewContent?: string;
  onContentChange?: (content: string) => void;
}

export function DataFlowVisualizer({
  editorContent,
  previewContent,
  onContentChange
}: DataFlowVisualizerProps) {
  const [flowSteps, setFlowSteps] = useState<DataFlowStep[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [isMonitoring, setIsMonitoring] = useState(false);

  const addFlowStep = (step: Omit<DataFlowStep, 'id' | 'timestamp'>) => {
    const newStep: DataFlowStep = {
      ...step,
      id: `step_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString()
    };
    setFlowSteps(prev => [newStep, ...prev.slice(0, 19)]); // Keep last 20 steps
  };

  const monitorDataFlow = () => {
    setIsMonitoring(true);
    addFlowStep({
      name: 'データフロー監視開始',
      status: 'processing',
      input: 'Editor → Preview',
      output: '監視中...'
    });

    // Monitor editor changes
    const editorElement = document.querySelector('.ProseMirror');
    if (editorElement) {
      let lastContent = editorElement.innerHTML;
      
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'childList' || mutation.type === 'characterData') {
            const currentContent = editorElement.innerHTML;
            if (currentContent !== lastContent) {
              addFlowStep({
                name: 'エディタ内容変更検知',
                status: 'success',
                input: lastContent.substring(0, 50) + '...',
                output: currentContent.substring(0, 50) + '...',
                duration: Date.now() - parseInt(lastContent.match(/\d+/)?.[0] || '0')
              });
              lastContent = currentContent;
            }
          }
        });
      });

      observer.observe(editorElement, {
        childList: true,
        subtree: true,
        characterData: true
      });

      // Monitor preview changes
      const previewElement = document.querySelector('.prose');
      if (previewElement) {
        let lastPreviewContent = previewElement.innerHTML;
        
        const previewObserver = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            if (mutation.type === 'childList' || mutation.type === 'characterData') {
              const currentPreviewContent = previewElement.innerHTML;
              if (currentPreviewContent !== lastPreviewContent) {
                addFlowStep({
                  name: 'プレビュー内容更新',
                  status: 'success',
                  input: lastPreviewContent.substring(0, 50) + '...',
                  output: currentPreviewContent.substring(0, 50) + '...',
                  duration: Date.now() - parseInt(lastPreviewContent.match(/\d+/)?.[0] || '0')
                });
                lastPreviewContent = currentPreviewContent;
              }
            }
          });
        });

        previewObserver.observe(previewElement, {
          childList: true,
          subtree: true,
          characterData: true
        });

        // Store observers for cleanup
        (window as any).__dataFlowObservers = [observer, previewObserver];
      }
    }
  };

  const stopMonitoring = () => {
    setIsMonitoring(false);
    const observers = (window as any).__dataFlowObservers;
    if (observers) {
      observers.forEach((observer: MutationObserver) => observer.disconnect());
      delete (window as any).__dataFlowObservers;
    }
    addFlowStep({
      name: 'データフロー監視停止',
      status: 'success',
      input: '監視中',
      output: '停止'
    });
  };

  const testDataFlow = async () => {
    addFlowStep({
      name: 'データフローテスト開始',
      status: 'processing',
      input: 'テスト用コンテンツ',
      output: '準備中...'
    });

    try {
      // Step 1: Editor Update
      const editorElement = document.querySelector('.ProseMirror');
      if (editorElement) {
        const testContent = '<p>データフローテスト - ' + new Date().toLocaleTimeString() + '</p>';
        const originalContent = editorElement.innerHTML;
        
        addFlowStep({
          name: 'Step 1: エディタ更新',
          status: 'processing',
          input: originalContent.substring(0, 50) + '...',
          output: 'テストコンテンツ追加中...'
        });

        editorElement.innerHTML = originalContent + testContent;
        
        // Trigger events
        editorElement.dispatchEvent(new Event('input', { bubbles: true }));
        editorElement.dispatchEvent(new Event('change', { bubbles: true }));
        editorElement.dispatchEvent(new Event('keyup', { bubbles: true }));

        addFlowStep({
          name: 'Step 1: エディタ更新完了',
          status: 'success',
          input: originalContent.substring(0, 50) + '...',
          output: (originalContent + testContent).substring(0, 50) + '...'
        });

        // Step 2: Wait for preview update
        setTimeout(() => {
          const previewElement = document.querySelector('.prose');
          if (previewElement) {
            const previewContent = previewElement.innerHTML;
            const hasTestContent = previewContent.includes('データフローテスト');
            
            addFlowStep({
              name: 'Step 2: プレビュー更新確認',
              status: hasTestContent ? 'success' : 'error',
              input: 'エディタ更新',
              output: previewContent.substring(0, 50) + '...',
              error: hasTestContent ? undefined : 'プレビューにテストコンテンツが反映されていません'
            });

            if (hasTestContent) {
              addFlowStep({
                name: 'データフローテスト完了',
                status: 'success',
                input: 'Editor → Preview',
                output: '正常に動作しています'
              });
            }
          }
        }, 500);
      }
    } catch (error) {
      addFlowStep({
        name: 'データフローテストエラー',
        status: 'error',
        input: 'テスト実行',
        output: '',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  useEffect(() => {
    if (editorContent && previewContent) {
      addFlowStep({
        name: 'リアルタイム監視',
        status: 'success',
        input: editorContent.substring(0, 50) + '...',
        output: previewContent.substring(0, 50) + '...'
      });
    }
  }, [editorContent, previewContent]);

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      backgroundColor: '#1a1a1a',
      color: 'white',
      padding: '16px',
      borderRadius: '8px',
      zIndex: 1000,
      width: '350px',
      maxHeight: '80vh',
      overflowY: 'auto',
      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
      border: '1px solid #333'
    }}>
      <h3 style={{ 
        margin: '0 0 12px 0', 
        color: '#4CAF50', 
        fontSize: '14px',
        fontWeight: 'bold'
      }}>
        🔄 データフロー可視化システム
      </h3>
      
      <div style={{ marginBottom: '12px' }}>
        <button
          onClick={() => setIsVisible(!isVisible)}
          style={{
            backgroundColor: '#555',
            color: 'white',
            border: 'none',
            padding: '6px 12px',
            borderRadius: '4px',
            cursor: 'pointer',
            marginRight: '8px'
          }}
        >
          {isVisible ? '非表示' : '表示'}
        </button>
      </div>

      {isVisible && (
        <>
          <div style={{ marginBottom: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={isMonitoring ? stopMonitoring : monitorDataFlow}
              style={{
                backgroundColor: isMonitoring ? '#f44336' : '#2196F3',
                color: 'white',
                border: 'none',
                padding: '8px 12px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              {isMonitoring ? '監視停止' : '監視開始'}
            </button>
            
            <button
              onClick={testDataFlow}
              style={{
                backgroundColor: '#FF9800',
                color: 'white',
                border: 'none',
                padding: '8px 12px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              テスト実行
            </button>
            
            <button
              onClick={() => setFlowSteps([])}
              style={{
                backgroundColor: '#9E9E9E',
                color: 'white',
                border: 'none',
                padding: '8px 12px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              クリア
            </button>
          </div>

          <div style={{ 
            maxHeight: '300px', 
            overflowY: 'auto', 
            border: '1px solid #444', 
            padding: '8px', 
            borderRadius: '4px', 
            backgroundColor: '#222' 
          }}>
            {flowSteps.length === 0 ? (
              <div style={{ fontSize: '12px', color: '#888', textAlign: 'center', padding: '20px' }}>
                データフロー監視を開始してください
              </div>
            ) : (
              flowSteps.map((step, index) => (
                <div key={step.id} style={{ 
                  marginBottom: '8px', 
                  borderBottom: '1px dashed #444', 
                  paddingBottom: '8px',
                  fontSize: '11px'
                }}>
                  <div style={{ 
                    color: step.status === 'success' ? '#8BC34A' : 
                           step.status === 'error' ? '#FF5252' : 
                           step.status === 'processing' ? '#FFC107' : '#9E9E9E',
                    fontWeight: 'bold',
                    marginBottom: '4px'
                  }}>
                    {step.status === 'success' ? '✅' : 
                     step.status === 'error' ? '❌' : 
                     step.status === 'processing' ? '⏳' : '⏸️'} 
                    {step.name}
                    {step.duration && ` (${step.duration}ms)`}
                  </div>
                  
                  {step.input && (
                    <div style={{ fontSize: '10px', color: '#aaa', marginBottom: '2px' }}>
                      <strong>入力:</strong> {step.input}
                    </div>
                  )}
                  
                  {step.output && (
                    <div style={{ fontSize: '10px', color: '#aaa', marginBottom: '2px' }}>
                      <strong>出力:</strong> {step.output}
                    </div>
                  )}
                  
                  {step.error && (
                    <div style={{ fontSize: '10px', color: '#FF5252' }}>
                      <strong>エラー:</strong> {step.error}
                    </div>
                  )}
                  
                  <div style={{ fontSize: '9px', color: '#666' }}>
                    {new Date(step.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))
            )}
          </div>

          <div style={{ 
            marginTop: '12px', 
            fontSize: '10px', 
            color: '#ccc',
            borderTop: '1px solid #444',
            paddingTop: '8px'
          }}>
            <div>現在のエディタ内容: {editorContent?.substring(0, 30)}...</div>
            <div>現在のプレビュー内容: {previewContent?.substring(0, 30)}...</div>
            <div>監視状態: {isMonitoring ? '🟢 監視中' : '🔴 停止中'}</div>
          </div>
        </>
      )}
    </div>
  );
}
