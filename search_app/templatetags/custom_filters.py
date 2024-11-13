from django import template
from urllib.parse import urlencode

register = template.Library()

@register.filter
def remove_page_param(query_dict):
    """ページ番号 (page) 以外のクエリパラメータを保持する"""
    query_dict = query_dict.copy()
    query_dict.pop('page', None)
    return urlencode(query_dict)
