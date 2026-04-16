from django.urls import path
from .views import prompts_list_create, prompt_detail

urlpatterns = [
    path('prompts/', prompts_list_create, name='prompts-list-create'),
    path('prompts/<uuid:pk>/', prompt_detail, name='prompt-detail'),
]
