import json
import os
import redis
from django.http import JsonResponse, HttpResponseBadRequest, HttpResponseNotFound
from django.views.decorators.csrf import csrf_exempt
from django.core.exceptions import ValidationError
from .models import Prompt

# Redis connection with grace fallback for native local run
redis_url = os.environ.get('REDIS_URL', 'redis://localhost:6379/1')
try:
    redis_client = redis.from_url(redis_url)
    redis_client.ping()
    redis_enabled = True
except (redis.ConnectionError, redis.TimeoutError, Exception):
    redis_enabled = False
    _view_counter_mock = {}


@csrf_exempt
def prompts_list_create(request):
    if request.method == 'GET':
        prompts = Prompt.objects.all().order_by('-created_at')
        return JsonResponse([p.to_dict() for p in prompts], safe=False)
    
    elif request.method == 'POST':
        try:
            data = json.loads(request.body)
            # basic validation
            if not data.get('title') or len(data['title']) < 3:
                return HttpResponseBadRequest("Title must be at least 3 characters")
            if not data.get('content') or len(data['content']) < 20:
                return HttpResponseBadRequest("Content must be at least 20 characters")
            complexity = data.get('complexity')
            if complexity is None or not (1 <= int(complexity) <= 10):
                return HttpResponseBadRequest("Complexity must be an integer between 1 and 10")
            
            prompt = Prompt.objects.create(
                title=data['title'],
                content=data['content'],
                complexity=int(complexity)
            )
            return JsonResponse(prompt.to_dict(), status=201)
        except json.JSONDecodeError:
            return HttpResponseBadRequest("Invalid JSON")
        except Exception as e:
            return HttpResponseBadRequest(str(e))
    
    return HttpResponseBadRequest("Invalid Method")

@csrf_exempt
def prompt_detail(request, pk):
    if request.method == 'GET':
        try:
            prompt = Prompt.objects.get(pk=pk)
        except Prompt.DoesNotExist:
            return HttpResponseNotFound("Prompt not found")
        
        # Increment view count
        view_key = f"prompt:views:{pk}"
        if redis_enabled:
            redis_client.incr(view_key)
            view_count = int(redis_client.get(view_key) or 0)
        else:
            _view_counter_mock[view_key] = _view_counter_mock.get(view_key, 0) + 1
            view_count = _view_counter_mock[view_key]
        
        data = prompt.to_dict()
        data['view_count'] = view_count
        return JsonResponse(data)
    
    return HttpResponseBadRequest("Invalid Method")
