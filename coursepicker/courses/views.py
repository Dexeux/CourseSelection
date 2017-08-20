from rest_framework import status
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from rest_framework.authentication import TokenAuthentication
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model
from django.db.models import Q
from courses.models import Course
import json

User = get_user_model()

@api_view(['GET', 'POST'])
@authentication_classes((TokenAuthentication,))
def courses(request):
    if request.method == 'POST':
        return create_courses(request)
    else:
        return get_courses(request)



@permission_classes((IsAuthenticated,))
def create_courses(request):
    """
    Create a course or list of courses
    Request load: [{courseCode: '', courseName: '', courseSubject: ''}]
    """
    response = Response(data={'status': 'error'}, status=status.HTTP_200_OK)
    request_data = json.loads(request.body)
    if isinstance(request_data, list): #Add a list of courses
        for request_course in request_data:
            if request_course.get('courseCode') and request_course.get('courseName') and request_course.get('courseSubject'):
                if Course.objects.filter(course_code=request_course.get('courseCode')).exists():
                    continue
                else:
                    course = Course(course_code=request_course.get('courseCode'),
                                    course_name=request_course.get('courseName'),
                                    course_subject=request_course.get('courseSubject'))
                    course.save()
                    response.data = {
                        'status': 'success'
                    }
    elif request_data.get('courseCode') and request_data.get('courseName') and request_data.get('courseSubject'): #Add a course
        if Course.objects.filter(course_code=request_data.get('courseCode')).exists():
            response.data = {'status': 'error', 'message': 'Course code exists'}
        else:
            course = Course(course_code=request_data.get('courseCode'), course_name=request_data.get('courseName'),
                            course_subject=request_data.get('courseSubject'))
            course.save()
            response.data = {
                    'status': 'success'
                }

    return response

def get_courses(request):
    """
    Get a list of course
    Request load: {searchParam: ''}
    """
    response = Response(data={'status': 'error'}, status=status.HTTP_200_OK)
    user = request.user
    search =  request.GET.get('query', '')
    if user: #Get courses user is not in
        course_list = Course.objects.filter((Q(course_code__contains=search) | Q(course_name__contains=search)|Q(course_subject__contains=search)) & ~Q(student__id=user.id))
    else:
        course_list = Course.objects.filter(Q(course_code__contains=search) | Q(course_name__contains=search) | Q(course_subject__contains=search))
    courses_dict = ([obj.as_dict() for obj in course_list])
    response.data = {
            'status': 'success',
            'data': courses_dict
        }
    return response



@api_view(['GET', 'POST'])
@authentication_classes((TokenAuthentication,))
@permission_classes((IsAuthenticated,))
def register(request):
    if request.method == 'POST':
        return register_courses(request)
    else:
        return get_registered(request)

def register_courses(request):
    """
    Add a course to your registered list
    Request load: [{courseCode: ''}]
    """
    user = request.user
    response = Response(data={'status': 'error'}, status=status.HTTP_200_OK)
    request_data = json.loads(request.body)
    if isinstance(request_data, list):
        for request_course in request_data:
            if request_course.get('courseCode'):
                course_code = request_course.get('courseCode')
                course_qset = Course.objects.filter(course_code=course_code)
                if course_qset.exists():
                    course = course_qset.get()
                    course.student.add(user)
                    course.save()
                    response.data = {
                            'status': 'success',
                        }

    return response

def get_registered(request):
    """
    See your list of registered courses
    """
    response = Response(data={'status': 'error'}, status=status.HTTP_200_OK)
    user = request.user
    user_courses = user.course_set.all()
    courses_dict = ([obj.as_dict() for obj in user_courses])
    response.data = {
            'status': 'success',
            'data': courses_dict
        }
    return response

@api_view(['POST'])
@authentication_classes((TokenAuthentication,))
@permission_classes((IsAuthenticated,))
def unregister(request):
    """
    Removes a course from your registered list
    Request load: [{courseCode: ''}]
    """
    user = request.user
    response = Response(data={'status': 'error'}, status=status.HTTP_200_OK)
    request_data = json.loads(request.body)
    if isinstance(request_data, list):
        for request_course in request_data:
            if request_course.get('courseCode'):
                course_code = request_course.get('courseCode')
                course_qset = Course.objects.filter(course_code=course_code)
                if course_qset.exists():
                    course = course_qset.get()
                    course.student.remove(user)
                    course.save()
                    response.data = {
                            'status': 'success',
                        }

    return response