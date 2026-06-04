import { BlogPost, ResourceKind } from '../types';

export function getPostResourceKind(post: BlogPost): ResourceKind {
  if (post.resourceKind && post.resourceKind !== 'none') return post.resourceKind;
  if (post.resourceText?.trim()) return 'text';
  if (post.resourceLink?.trim()) {
    const link = post.resourceLink.toLowerCase();
    if (post.resourcePassword || link.includes('pan.') || link.includes('aliyundrive') || link.includes('123pan')) {
      return 'cloud';
    }
    return 'web';
  }
  return 'none';
}

export function postHasShareableResource(post: BlogPost): boolean {
  return (
    getPostResourceKind(post) !== 'none' ||
    Boolean(post.resourceName) ||
    (post.extraLinks?.length ?? 0) > 0
  );
}

export function postMatchesResourceCategory(post: BlogPost): boolean {
  return post.category === '学习资料' || post.category === '资源链接' || postHasShareableResource(post);
}
