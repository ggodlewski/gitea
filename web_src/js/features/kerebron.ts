import { CoreEditor } from '@kerebron/editor';
import { AdvancedEditorKit } from '@kerebron/editor-kits/AdvancedEditorKit';
import { createAssetLoad } from '@kerebron/wasm/web';

import '@kerebron/editor/assets/index.css';
import '@kerebron/editor-kits/assets/AdvancedEditorKit.css';
import './kerebron.css';

function getExt(fileName: string) {
  const idx = fileName.lastIndexOf('.');
  if (idx > -1) {
    return fileName.substring(idx);
  }
  return '';
}

function makeRelative(filePath: string, basePath: string): string {
  const base = new URL(basePath.endsWith('/') ? basePath : basePath + '/', 'https://example.com');
  const file = new URL(filePath, 'https://example.com');

  if (!file.pathname.startsWith(base.pathname)) {
    return file.pathname;
  }

  return file.pathname.slice(base.pathname.length);
}

export function createRichEditor(element?: HTMLElement) {
  if (!element) {
    return undefined;
  }
  const elForm = document.querySelector<HTMLFormElement>('.repository.editor .edit.form')!;
  const elTabMenu = elForm.querySelector('.repo-editor-menu');
  if (!elTabMenu) return;

  const elTreePath = elForm.querySelector<HTMLInputElement>('input#tree_path');
  const elTextarea = elForm.querySelector<HTMLTextAreaElement>('.tab[data-tab="write"] textarea');
  if (!elTreePath || !elTextarea) return;

  const repoLink = elTabMenu.getAttribute('data-repo-link')!;
  const refSubUrl = elTabMenu.getAttribute('data-ref-sub-url')!;
  const branchName = elTabMenu.getAttribute('data-branch-name')!;

  const editor = CoreEditor.create({
    uri: 'example.md',
    element,
    assetLoad: createAssetLoad('/node_modules/@kerebron/wasm/assets'),
    editorKits: [new AdvancedEditorKit()],
  });

  editor
    .chain()
    .setFromMarkdownUrlRewriter(async (href, ctx) => {
      if (ctx.type === 'IMG') {
        if (/^(https?:|data:)/.test(href)) {
          return href;
        }
        const parts = elTreePath.value.split('/');
        parts.pop();
        const dirPath = parts.join('/');
        return repoLink + '/media/' + refSubUrl + '/' + dirPath + '/' + href;
      }
      return href;
    })
    .setToMarkdownUrlRewriter(async (href, ctx) => {
      if (ctx.type === 'IMG') {
        if (/^(https?:|data:)/.test(href)) {
          return href;
        }
        const parts = elTreePath.value.split('/');
        parts.pop();
        const dirPath = parts.join('/');

        if (href.startsWith(repoLink + '/media/' + refSubUrl)) {
          href = href.substring((repoLink + '/media/' + refSubUrl).length);
          if (!href.startsWith('/') && !href.startsWith('.')) {
            href = './' + href;
          }
          return makeRelative(href, dirPath);
        }
      }
      return href;
    })
    .run();

  return editor;
}
