import { apiRequest } from './api.js';

export function listSocialAccounts(accessToken) {
  return apiRequest('/marketing/social-accounts', accessToken);
}

export function createSocialAccount(accessToken, account) {
  return apiRequest('/marketing/social-accounts', accessToken, {
    method: 'POST',
    body: JSON.stringify(account),
  });
}

export function updateSocialAccount(accessToken, id, account) {
  return apiRequest(`/marketing/social-accounts/${id}`, accessToken, {
    method: 'PATCH',
    body: JSON.stringify(account),
  });
}

export function deleteSocialAccount(accessToken, id) {
  return apiRequest(`/marketing/social-accounts/${id}`, accessToken, {
    method: 'DELETE',
  });
}

export function listPosts(accessToken) {
  return apiRequest('/marketing/posts', accessToken);
}

export function createPost(accessToken, post) {
  return apiRequest('/marketing/posts', accessToken, {
    method: 'POST',
    body: JSON.stringify(post),
  });
}

export function updatePost(accessToken, id, post) {
  return apiRequest(`/marketing/posts/${id}`, accessToken, {
    method: 'PATCH',
    body: JSON.stringify(post),
  });
}

export function deletePost(accessToken, id) {
  return apiRequest(`/marketing/posts/${id}`, accessToken, {
    method: 'DELETE',
  });
}
