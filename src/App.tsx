"use client";

import React, { useState, useEffect } from "react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "./components/ui/sonner";
import { Header } from "./components/header";
import { Footer } from "./components/footer";
import { HomePage } from "./pages/home-page";
import { AboutPage } from "./pages/about-page";
import { ProjectsPage } from "./pages/projects-page";
import { ProjectDetailPage } from "./pages/project-detail-page";
import { PapersPage } from "./pages/papers-page";
import { NewsPage } from "./pages/news-page";
import { NewsDetailPage } from "./pages/news-detail-page";
import { ContactPage } from "./pages/contact-page";
import { EditModePage } from "./pages/edit-mode-page";
import { ErrorBoundary } from "./components/error-boundary";
import { Locale, defaultLocale } from "./lib/types";

type HistoryState = {
  page: string;
  slug: string | null;
};

const VALID_PAGES = new Set([
  "home",
  "about",
  "projects",
  "project-detail",
  "papers",
  "news",
  "news-detail",
  "contact",
  "edit-mode",
]);

const parseHistoryState = (
  state: Partial<HistoryState> | null | undefined
): HistoryState => {
  if (!state) {
    return { page: "home", slug: null };
  }

  let page = state.page && VALID_PAGES.has(state.page) ? state.page : "home";
  let slug = state.slug ? state.slug : null;

  if (page === "project-detail" && !slug) {
    page = "projects";
  }

  if (page === "news-detail" && !slug) {
    page = "news";
  }

  return { page, slug };
};

const getStateFromLocation = (): HistoryState => {
  if (typeof window === "undefined") {
    return { page: "home", slug: null };
  }
  const pathname = window.location.pathname;
  const params = new URLSearchParams(window.location.search);
  const pageParam = params.get("page");
  const slugParam = params.get("slug");
  return parseHistoryState({
    page: pageParam ?? undefined,
    slug: slugParam ?? undefined,
  });
};

const buildUrl = (page: string, slug: string | null) => {
  if (typeof window === "undefined") {
    return undefined;
  }

  const url = new URL(window.location.href);

  if (page === "home" && !slug) {
    url.searchParams.delete("page");
    url.searchParams.delete("slug");
  } else {
    url.searchParams.set("page", page);
    if (slug) {
      url.searchParams.set("slug", slug);
    } else {
      url.searchParams.delete("slug");
    }
  }

  url.hash = "";

  return `${url.pathname}${url.search}`;
};

export default function App() {
  const [currentLocale, setCurrentLocale] = useState<Locale>(defaultLocale);
  const [currentPage, setCurrentPage] = useState("home");
  const [currentSlug, setCurrentSlug] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [pageFadeIn, setPageFadeIn] = useState(false);
  const mainElementRef = React.useRef<HTMLElement | null>(null);
  
  // フェードインアニメーションの時間（ミリ秒）
  const FADE_DURATION = 500; // 500ms = 0.5秒
  
  // pageFadeInの変更を監視して、DOMを直接操作する
  useEffect(() => {
    if (!mainElementRef.current) return;
    
    console.log('=== FADE IN STATE CHANGE ===');
    console.log('pageFadeIn:', pageFadeIn);
    
    // DOMを直接操作してopacityを設定
    const mainElement = mainElementRef.current;
    
    if (pageFadeIn) {
      console.log('Setting opacity to 1 via DOM');
      
      // アニメーションを強制的にリセット
      // 1. トランジションを無効化
      mainElement.style.setProperty('transition', 'none', 'important');
      // 2. アニメーションをキャンセル（offsetWidthを読み取ることでレイアウトを強制）
      void mainElement.offsetWidth;
      // 3. opacity: 0を設定（確実に0から開始）
      mainElement.style.setProperty('opacity', '0', 'important');
      
      // 次のフレームでトランジションを有効化してからopacity: 1に変更
      requestAnimationFrame(() => {
        // トランジションを有効化
        mainElement.style.setProperty('transition', `opacity ${FADE_DURATION}ms ease-in-out`, 'important');
        mainElement.style.setProperty('pointer-events', 'auto', 'important');
        
        // その次のフレームでopacity: 1に変更（これによりフェードインが開始される）
        requestAnimationFrame(() => {
          mainElement.style.setProperty('opacity', '1', 'important');
          
          // 設定後の状態を確認
          requestAnimationFrame(() => {
            const computedStyle = window.getComputedStyle(mainElement);
            console.log('After DOM set - computed opacity:', computedStyle.opacity);
            console.log('After DOM set - inline style opacity:', mainElement.style.opacity);
          });
        });
      });
    } else {
      console.log('Setting opacity to 0 via DOM');
      // まずトランジションを無効化して即座に値を設定
      mainElement.style.setProperty('transition', 'none', 'important');
      mainElement.style.setProperty('opacity', '0', 'important');
      mainElement.style.setProperty('pointer-events', 'none', 'important');
      
      // 次のフレームでトランジションを有効化
      requestAnimationFrame(() => {
        mainElement.style.setProperty('transition', `opacity ${FADE_DURATION}ms ease-in-out`, 'important');
        
        // 設定後の状態を確認
        const computedStyle = window.getComputedStyle(mainElement);
        console.log('After DOM set - computed opacity:', computedStyle.opacity);
        console.log('After DOM set - inline style opacity:', mainElement.style.opacity);
      });
    }
  }, [pageFadeIn]);
  
  // ページ変更時にフェードインを開始
  useEffect(() => {
    if (!mounted) return;
    
    console.log('=== PAGE CHANGE DETECTED ===');
    console.log('App: Page changed, resetting fade in. currentPage:', currentPage, 'currentSlug:', currentSlug);
    
    // ページ変更時にフェードインをリセット
    console.log('Setting pageFadeIn to false');
    setPageFadeIn(false);
    
    // DOMが更新されるのを待つ（複数のRAFで確実に待つ）
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          // DOM要素が確実にopacity: 0になっていることを確認
          if (mainElementRef.current) {
            const mainElement = mainElementRef.current;
            const computedStyle = window.getComputedStyle(mainElement);
            console.log('Before fade in - computed opacity:', computedStyle.opacity);
            
            // もしまだopacityが0でない場合、強制的に設定（トランジションを無効化してから）
            if (computedStyle.opacity !== '0') {
              console.log('Forcing opacity to 0 with !important');
              mainElement.style.setProperty('transition', 'none', 'important');
              mainElement.style.setProperty('opacity', '0', 'important');
              
              // 次のフレームでトランジションを復元
              requestAnimationFrame(() => {
                mainElement.style.setProperty('transition', `opacity ${FADE_DURATION}ms ease-in-out`, 'important');
              });
            }
            
            // 少し待ってからフェードインを開始
            setTimeout(() => {
              console.log('Setting pageFadeIn to true');
              setPageFadeIn(true);
            }, 100);
          }
        });
      });
    });
  }, [currentPage, currentSlug, mounted]);

  useEffect(() => {
    if (typeof window === "undefined") {
      setMounted(true);
      return;
    }

    const initialState = getStateFromLocation();
    setCurrentPage(initialState.page);
    setCurrentSlug(initialState.slug);
    const initialUrl = buildUrl(initialState.page, initialState.slug);
    if (initialUrl) {
      window.history.replaceState(initialState, "", initialUrl);
    }
    
    // 初期ロード時のみフェードインを開始（少し遅延してから）
    // main要素の初期状態を設定（refが設定されるのを待つ）
    requestAnimationFrame(() => {
      if (mainElementRef.current) {
        mainElementRef.current.style.setProperty('opacity', '0', 'important');
        mainElementRef.current.style.setProperty('transition', `opacity ${FADE_DURATION}ms ease-in-out`, 'important');
        mainElementRef.current.style.setProperty('pointer-events', 'none', 'important');
      }
      
      setTimeout(() => {
        console.log('App: Starting initial fade in');
        setPageFadeIn(true);
      }, 100);
    });

    const handlePopState = (event: PopStateEvent) => {
      // ブラウザの戻る/進むボタンでもフェードイン
      console.log('App: PopState event');
      const state = parseHistoryState(event.state ?? getStateFromLocation());
      
      // まずフェードアウト
      setPageFadeIn(false);
      
      // opacity: 0が確実に適用されるまで待つ
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          // DOM要素が確実にopacity: 0になっていることを確認
          if (mainElementRef.current) {
            const mainElement = mainElementRef.current;
            const computedStyle = window.getComputedStyle(mainElement);
            
            // opacityが0でない場合、強制的に0にする
            if (computedStyle.opacity !== '0') {
              mainElement.style.setProperty('transition', 'none', 'important');
              mainElement.style.setProperty('opacity', '0', 'important');
              mainElement.style.setProperty('pointer-events', 'none', 'important');
            }
            
            // もう一度RAFを待ってからページを変更
            requestAnimationFrame(() => {
              // ページを変更（useEffectでフェードインが開始される）
              setCurrentPage(state.page);
              setCurrentSlug(state.slug);
            });
          } else {
            // main要素がまだ存在しない場合、即座にページを変更
            setCurrentPage(state.page);
            setCurrentSlug(state.slug);
          }
        });
      });
    };

    window.addEventListener("popstate", handlePopState);
    setMounted(true);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const navigate = (page: string, slug?: string) => {
    console.log('=== NAVIGATE CALLED ===');
    console.log('App: Starting page transition to', page, slug);
    console.log('Current pageFadeIn before navigation:', pageFadeIn);
    
    // まずフェードアウト（opacity: 0にする）
    console.log('Setting pageFadeIn to false (fade out)');
    setPageFadeIn(false);
    
    // opacity: 0が確実に適用されるまで待つ
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        // DOM要素が確実にopacity: 0になっていることを確認
        if (mainElementRef.current) {
          const mainElement = mainElementRef.current;
          const computedStyle = window.getComputedStyle(mainElement);
          console.log('Before page change - computed opacity:', computedStyle.opacity);
          
          // opacityが0でない場合、強制的に0にする
          if (computedStyle.opacity !== '0') {
            console.log('Forcing opacity to 0 before page change');
            mainElement.style.setProperty('transition', 'none', 'important');
            mainElement.style.setProperty('opacity', '0', 'important');
            mainElement.style.setProperty('pointer-events', 'none', 'important');
          }
          
          // もう一度RAFを待ってからページを変更
          requestAnimationFrame(() => {
            // ページを変更（useEffectでフェードインが開始される）
            console.log('Setting currentPage to:', page);
            setCurrentPage(page);
            if (slug) {
              console.log('Setting currentSlug to:', slug);
              setCurrentSlug(slug);
            } else {
              console.log('Setting currentSlug to null');
              setCurrentSlug(null);
            }

            const nextState: HistoryState = { page, slug: slug ?? null };
            const nextUrl = buildUrl(page, nextState.slug);

            if (typeof window !== "undefined" && nextUrl) {
              window.history.pushState(nextState, "", nextUrl);
              console.log('History updated:', nextUrl);
            }
          });
        } else {
          // main要素がまだ存在しない場合、即座にページを変更
          setCurrentPage(page);
          if (slug) {
            setCurrentSlug(slug);
          } else {
            setCurrentSlug(null);
          }

          const nextState: HistoryState = { page, slug: slug ?? null };
          const nextUrl = buildUrl(page, nextState.slug);

          if (typeof window !== "undefined" && nextUrl) {
            window.history.pushState(nextState, "", nextUrl);
          }
        }
      });
    });
  };

  const renderPage = () => {
    // ページ遷移時にコンポーネントを強制的に再マウントさせるためにkeyを追加
    const pageKey = `${currentPage}-${currentSlug || ''}-${currentLocale}`;
    
    switch (currentPage) {
      case "home":
        return <div key={pageKey}><HomePage locale={currentLocale} onNavigate={navigate} /></div>;
      case "about":
        return <div key={pageKey}><AboutPage locale={currentLocale} /></div>;
      case "projects":
        return <div key={pageKey}><ProjectsPage locale={currentLocale} onNavigate={navigate} /></div>;
      case "project-detail":
        return (
          <div key={pageKey}>
            <ProjectDetailPage
              locale={currentLocale}
              slug={currentSlug!}
              onNavigate={navigate}
            />
          </div>
        );
      case "papers":
        return <div key={pageKey}><PapersPage locale={currentLocale} /></div>;
      case "news":
        return <div key={pageKey}><NewsPage locale={currentLocale} onNavigate={navigate} /></div>;
      case "news-detail":
        return (
          <div key={pageKey}>
            <NewsDetailPage
              locale={currentLocale}
              slug={currentSlug!}
              onNavigate={navigate}
            />
          </div>
        );
      case "contact":
        return <div key={pageKey}><ContactPage locale={currentLocale} /></div>;
      case "edit-mode":
        return <div key={pageKey}><EditModePage /></div>;
      default:
        return <div key={pageKey}><HomePage locale={currentLocale} onNavigate={navigate} /></div>;
    }
  };

  if (!mounted) {
    return (
      <div className="size-full flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  const isEditProto = currentPage === "edit-proto";

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <ErrorBoundary>
        {isEditProto ? (
          // No outer header/footer for editor
          <div className="bg-background">{renderPage()}</div>
        ) : (
          <div className="min-h-screen bg-background flex flex-col">
            <Header
              locale={currentLocale}
              currentPage={currentPage}
              onNavigate={navigate}
              onLocaleChange={setCurrentLocale}
            />
            <main 
              ref={mainElementRef}
              className="flex-1"
              style={{
                willChange: 'opacity'
              } as React.CSSProperties}
            >
              {renderPage()}
            </main>
            <Footer locale={currentLocale} onNavigate={navigate} />
            <Toaster />
          </div>
        )}
      </ErrorBoundary>
    </ThemeProvider>
  );
}
