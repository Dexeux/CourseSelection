from django.test import TestCase, RequestFactory
from django.contrib.auth.models import User
from auth.views import create_user, authenticate_user, refresh_token, delete_token
from rest_framework.test import force_authenticate
from rest_framework.authtoken.models import Token
import json

# Test requests
class AuthenticationRequests(TestCase):

    def setUp(self):
        self.factory = RequestFactory()

    def test_register(self):
        # Create an instance of a Post request.
        request = self.factory.post('/api/v1/auth/register', data=json.dumps({'username': 'name', 'password': 'password'}),
                                    content_type='application/json')

        # Test response
        response = create_user(request)
        self.assertEqual(response.data['status'], 'success')
        # See if user is added
        self.assertEqual(len(User.objects.all()), 1)

    def test_login(self):
        User.objects.create_user(username='name', password='password')
        # Create an instance of a Post request.
        request = self.factory.post('/api/v1/auth/login',
                                    data=json.dumps({'username': 'name', 'password': 'password'}),
                                    content_type='application/json')

        # Test response
        response = authenticate_user(request)
        self.assertEqual(response.data['status'], 'success')
        self.assertNotEqual(len(response.data['token']), 0)

    def test_getting_token(self):
        user = User.objects.create_user(username='name', password='password')
        # Create an instance of a Post request.
        request = self.factory.get('/api/v1/auth/token')

        # create a user
        force_authenticate(request, user=user)

        # Test response
        response = refresh_token(request)
        self.assertEqual(response.data['status'], 'success')
        self.assertNotEqual(len(response.data['token']), 0)

    def test_delete_token(self):
        user = User.objects.create_user(username='name', password='password')
        Token.objects.create(user=user)
        # Create an instance of a Post request.
        request = self.factory.delete('/api/v1/auth/logout')

        # create a user
        force_authenticate(request, user=user)

        # Test response
        response = delete_token(request)
        self.assertEqual(response.data['status'], 'success')
        # Should be zero token
        self.assertEqual(len(Token.objects.all()),0)

