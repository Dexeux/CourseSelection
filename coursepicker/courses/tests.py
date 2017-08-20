from django.test import TestCase, RequestFactory
from django.contrib.auth.models import User
from courses.models import Course
from courses.views import courses, register, unregister
from rest_framework.test import force_authenticate
import json

# Test models
class CourseTestModels(TestCase):
    def setUp(self):
        Course.objects.create(course_code='1234', course_name='course', course_subject='Math')
        Course.objects.create(course_code='4321', course_name='course1', course_subject='English')

    def test_can_get_course_by_code(self):
        course = Course.objects.get(course_code='1234')
        self.assertEqual(course.course_name, 'course')
        self.assertEqual(course.course_subject, 'Math')

# Test requests
class CourseRequests(TestCase):

    def setUp(self):
        self.factory = RequestFactory()
        self.user = User.objects.create_user(username='test', password='test')
        Course.objects.create(course_code='4321', course_name='course1', course_subject='English')

    def test_create_course(self):
        # Create an instance of a Post request.
        request = self.factory.post('/api/v1/courses/courses', data=json.dumps({'courseName': 'name', 'courseCode': 123, 'courseSubject': 'English'}),
                                    content_type='application/json')
        # create a user
        request.user = self.user
        # Test response
        response = courses(request)
        self.assertEqual(response.data['status'], 'success')
        # See if course is added
        course = Course.objects.get(course_code='123')
        self.assertEqual(course.course_name, 'name')

    def test_get_courses(self):
        # Create an instance of a get request.
        request = self.factory.get('/api/v1/courses/courses?query=')
        # create a user
        request.user = self.user
        # Test response
        response = courses(request)
        self.assertEqual(response.data['status'], 'success')
        self.assertEqual(len(response.data['data']), 1)

    def test_register(self):
        user = User.objects.create_user(username='user', email='mail', password='user')
        # Create an instance of a post request.
        request = self.factory.post('/api/v1/courses/register', data=json.dumps([{'courseName': 'course1', 'courseCode': '4321', 'courseSubject': 'English'}]),
                                    content_type='application/json')
        # create a user
        force_authenticate(request, user=user)

        # Test response
        response = register(request)
        self.assertEqual(response.data['status'], 'success')
        # User should be registered
        self.assertEqual(Course.objects.get(course_code='4321').student.get(username='user').email, 'mail')

    def test_get_registered(self):
        user = User.objects.create_user(username='user', email='mail', password='user')
        # Add user to a course
        course = Course.objects.create(course_code='54321', course_name='course2', course_subject='Math')
        course.student.add(user)
        course.save()
        # Create an instance of a post request.
        request = self.factory.get('/api/v1/courses/register')
        # create a user
        force_authenticate(request, user=user)

        # Test response
        response = register(request)
        self.assertEqual(response.data['status'], 'success')
        # User should get back 1 course
        self.assertEqual(len(response.data['data']), 1)

    def test_unregister(self):
        user = User.objects.create_user(username='user', email='mail', password='user')
        # Add user to a course
        course = Course.objects.create(course_code='54321', course_name='course2', course_subject='Math')
        course.student.add(user)
        course.save()
        # Create an instance of a post request.
        request = self.factory.post('/api/v1/courses/unregister', data=json.dumps([{'courseName': 'course2', 'courseCode': '54321', 'courseSubject': 'Math'}]),
                                    content_type='application/json')
        # create a user
        force_authenticate(request, user=user)

        # Test response
        response = unregister(request)
        self.assertEqual(response.data['status'], 'success')
        # Course should have zero students
        self.assertEqual(len(Course.objects.get(course_code='4321').student.all()), 0)


