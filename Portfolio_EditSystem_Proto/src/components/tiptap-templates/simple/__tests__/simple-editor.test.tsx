jest.mock('../../../tiptap-node/blockquote-node/blockquote-node.scss', () => ({}));
jest.mock('../../../tiptap-node/code-block-node/code-block-node.scss', () => ({}));
jest.mock('../../../tiptap-node/horizontal-rule-node/horizontal-rule-node.scss', () => ({}));
jest.mock('../../../tiptap-node/list-node/list-node.scss', () => ({}));
jest.mock('../../../tiptap-node/image-node/image-node.scss', () => ({}));
jest.mock('../../../tiptap-node/heading-node/heading-node.scss', () => ({}));
jest.mock('../../../tiptap-node/paragraph-node/paragraph-node.scss', () => ({}));
jest.mock('../simple-editor.scss', () => ({}));

﻿import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SimpleEditor } from '../simple-editor';
import { tiptapJSONToHTML, TiptapDocument } from '../../../../utils/convert';

jest.mock('../../../../hooks/use-mobile', () => ({
  useIsMobile: () => false,
}));

jest.mock('../../../../hooks/use-window-size', () => ({
  useWindowSize: () => ({ width: 1280, height: 720 }),
}));

jest.mock('../../../../hooks/use-cursor-visibility', () => ({
  useCursorVisibility: () => ({ isVisible: true }),
}));

jest.mock('../../../../lib/tiptap-utils', () => ({
  handleImageUpload: jest.fn(),
  MAX_FILE_SIZE: 5 * 1024 * 1024,
}));

jest.mock('../../../tiptap-ui-primitive/button', () => ({
  Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
}));

jest.mock('../../../tiptap-ui-primitive/spacer', () => ({
  Spacer: () => <div data-testid="spacer" />,
}));

jest.mock('../../../tiptap-ui-primitive/toolbar', () => {
  const React = require('react');
  return {
    Toolbar: React.forwardRef<HTMLDivElement, any>(({ children, ...props }, ref) => (
      <div data-testid="toolbar" ref={ref} {...props}>
        {children}
      </div>
    )),
    ToolbarGroup: ({ children, ...props }: any) => (
      <div data-testid="toolbar-group" {...props}>
        {children}
      </div>
    ),
    ToolbarSeparator: () => <div data-testid="toolbar-separator" />,
  };
});

jest.mock('../../../tiptap-ui/heading-dropdown-menu', () => ({
  HeadingDropdownMenu: () => <div data-testid="heading-dropdown" />,
}));

jest.mock('../../../tiptap-ui/image-upload-button', () => ({
  ImageUploadButton: () => <div data-testid="image-upload-button" />,
}));

jest.mock('../../../tiptap-ui/list-dropdown-menu', () => ({
  ListDropdownMenu: () => <div data-testid="list-dropdown" />,
}));

jest.mock('../../../tiptap-ui/blockquote-button', () => ({
  BlockquoteButton: () => <div data-testid="blockquote-button" />,
}));

jest.mock('../../../tiptap-ui/code-block-button', () => ({
  CodeBlockButton: () => <div data-testid="code-block-button" />,
}));

jest.mock('../../../tiptap-ui/color-highlight-popover', () => ({
  ColorHighlightPopover: () => <div data-testid="color-highlight-popover" />,
  ColorHighlightPopoverContent: () => <div data-testid="color-highlight-content" />,
  ColorHighlightPopoverButton: ({ children, ...props }: any) => (
    <button data-testid="color-highlight-button" {...props}>{children}</button>
  ),
}));

jest.mock('../../../tiptap-ui/link-popover', () => ({
  LinkPopover: () => <div data-testid="link-popover" />,
  LinkContent: () => <div data-testid="link-content" />,
  LinkButton: ({ children, ...props }: any) => <button data-testid="link-button" {...props}>{children}</button>,
}));

jest.mock('../../../tiptap-ui/mark-button', () => ({
  MarkButton: () => <div data-testid="mark-button" />,
}));

jest.mock('../../../tiptap-ui/text-align-button', () => ({
  TextAlignButton: () => <div data-testid="text-align-button" />,
}));

jest.mock('../../../tiptap-ui/undo-redo-button', () => ({
  UndoRedoButton: () => <div data-testid="undo-redo-button" />,
}));

jest.mock('../../../tiptap-node/image-upload-node/image-upload-node-extension', () => ({
  ImageUploadNode: { configure: () => ({}) },
}));

jest.mock('../theme-toggle', () => ({
  ThemeToggle: () => <div data-testid="theme-toggle" />,
}));

describe('SimpleEditor JSON pipeline', () => {
  let mockOnContentChange: jest.Mock;

  beforeEach(() => {
    mockOnContentChange = jest.fn();
  });

  const getLatestDoc = (): TiptapDocument => {
    const lastCall = mockOnContentChange.mock.calls.at(-1);
    if (!lastCall) {
      throw new Error('Expected onContentChange to be called');
    }
    return JSON.parse(lastCall[0]);
  };

  test.skip('emits heading node when typing markdown heading shortcut', async () => {
    const user = userEvent.setup();

    render(<SimpleEditor initialContent="" onContentChange={mockOnContentChange} />);

    await waitFor(() => {
      expect(screen.getByLabelText('Main content area, start typing to enter text.')).toBeInTheDocument();
    });

    await user.click(screen.getByLabelText('Main content area, start typing to enter text.'));
    await user.type(screen.getByLabelText('Main content area, start typing to enter text.'), '# 見出し');

    await waitFor(() => {
      expect(mockOnContentChange).toHaveBeenCalled();
    });

    const doc = getLatestDoc();
    expect(doc.type).toBe('doc');
    const heading = doc.content?.find(node => node.type === 'heading');
    expect(heading?.attrs?.level).toBe(1);
    expect(heading?.content?.[0]?.text).toBe('見出し');

    const html = tiptapJSONToHTML(doc);
    expect(html).toContain('<h1>見出し</h1>');
  });

  test.skip('emits bullet list structure when typing list markdown', async () => {
    const user = userEvent.setup();

    render(<SimpleEditor initialContent="" onContentChange={mockOnContentChange} />);

    await waitFor(() => {
      expect(screen.getByLabelText('Main content area, start typing to enter text.')).toBeInTheDocument();
    });

    await user.click(screen.getByLabelText('Main content area, start typing to enter text.'));
    await user.type(screen.getByLabelText('Main content area, start typing to enter text.'), '- 項目1{enter}- 項目2');

    await waitFor(() => {
      expect(mockOnContentChange).toHaveBeenCalled();
    });

    const doc = getLatestDoc();
    const bulletList = doc.content?.find(node => node.type === 'bulletList');
    expect(bulletList).toBeTruthy();
    expect(bulletList?.content?.length).toBeGreaterThanOrEqual(2);

    const html = tiptapJSONToHTML(doc);
    expect(html).toContain('<ul>');
    expect(html).toContain('項目1');
    expect(html).toContain('項目2');
  });

  test.skip('accepts JSON initialContent and preserves nodes', async () => {
    const initialDoc: TiptapDocument = {
      type: 'doc',
      content: [
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: '初期見出し' }],
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: '初期段落' }],
        },
      ],
    };

    render(
      <SimpleEditor
        initialContent={JSON.stringify(initialDoc)}
        onContentChange={mockOnContentChange}
      />,
    );

    await waitFor(() => {
      expect(screen.getByLabelText('Main content area, start typing to enter text.')).toBeInTheDocument();
    });

    const latestDoc = getLatestDoc();
    const heading = latestDoc.content?.find(node => node.type === 'heading');
    expect(heading?.attrs?.level).toBe(2);
    expect(heading?.content?.[0]?.text).toBe('初期見出し');
  });
});
