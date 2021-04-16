---
title: 'App Authentication with Laravel Sanctum'
excerpt: 'Learn how to use the Laravel Sanctum package to create simple API authentication for SPAs or mobile apps.'
coverImage: '/assets/blog/app-authentication-with-laravel-sanctum/cover.png'
darkCoverImage: '/assets/blog/app-authentication-with-laravel-sanctum/cover-dark.png'
tags: 'swift,laravel'
date: '2020-01-11T19:51:00.322Z'
author:
  name: Jille van der Weerd
  picture: '/assets/blog/authors/jj.jpeg'
ogImage:
  url: '/assets/blog/app-authentication-with-laravel-sanctum/cover.png'
---

I often use Laravel to build the API that support the apps I build, because I can quickly create something that just works without writing too much code. However, dealing with authentication has (in my opinion) always been a cumbersome task.

So it doesn’t come as a surprise that after seeing [Taylor Otwell’s Tweet about Laravel Sanctum](https://twitter.com/taylorotwell/status/1215022507478138882?s=20) (previously Laravel Airlock) I wanted to give this a try for authentication in a simple mobile application.

A quick introduction: Sanctum is a package for Laravel. It’s supposed to be a featherweight alternative to existing authentication methods (like Laravel Passport) for use in SPAs and simple APIs.

I’m going to briefly walk you through installing Sanctum, but if you run into any problems, please refer to the [documentation](https://github.com/laravel/sanctum). After installing Sanctum and building a simple authentication system with it, I’ll show you how to use it in your iOS app. I’ll assume you have basic Swift knowledge, and I won’t go in depth on creating the interface I’ll show in my screenshots.

## Installation

I created a new Laravel project to test this. I’ll assume you know how to do this, but for more information please refer to the [Laravel documentation](https://laravel.com/docs/8.x). cd into the project directory and execute the following commands in your terminal:

```bash
composer require laravel/sanctum
php artisan vendor:publish
php artisan migrate
```

We’re now ready to dive into the Laravel project to finalise setting up Sanctum.

In your `User` model, use the `HasApiTokens` trait as follows:

```php
use Laravel\Sanctum\HasApiTokens;
// Other imports omitted.
class User extends Authenticatable
{
    use HasApiTokens, Notifiable;
    // Class body omitted.
}
```

## Routes

Now that we’ve finished setting up, let’s create some routes. Add the following routes to your `routes/api.php` file:

```php
Route::prefix('sanctum')->namespace('API')->group(function() {
    Route::post('register', 'AuthController@register');
    Route::post('token', 'AuthController@token');
});
```

The user will use these two routes to register an account and to request their token (basically, to log in). Let’s create the `AuthController` and write the implementation of these routes. Run the following line in your terminal:

```bash
php artisan make:controller API\AuthController
```

Open the `app/Http/Controllers/API/AuthController.php` file you just created and add the `register` function:

```php
public function register(Request $request)
{ 
    // 1 
    $validator = Validator::make($request->all(), [
        'name' => ['required', 'string', 'max:255'],
        'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
        'password' => ['required', 'string', 'min:8'],
        'device_name' => ['required', 'string']
    ]); 

    // 2
    if ($validator->fails()) {
        return response()->json(['error' => $validator->errors()], 422);
    }

    // 3
    $input = $request->all();
    $input['password'] = bcrypt($input['password']);
    $user = User::create($input);

    // 4
    $token = $user->createToken($request->device_name)->plainTextToken;

    return response()->json(['token' => $token], 200);
}
```

Here’s a step by step breakdown of what this code does:

1. We validate the incoming request.
2. Check the outcome of this validation. If it failed, return the errors in the response.
3. Hash the password and create the new `User`.
4. Create a token and save it so we can return it in the response.

As you can see, performing a successful request to this endpoint will return the generated token in the body of the response. However, to make sure our users don’t need to create a new account whenever they want to use the app on another device, let’s create the function to allow our users to request their token:

```php
public function token(Request $request)
{
    // 1
    $validator = Validator::make($request->all(), [
        'email' => ['required', 'string', 'email', 'max:255'],
        'password' => ['required', 'string', 'min:8'],
        'device_name' => ['required', 'string']
    ]);    
    
    if ($validator->fails()) {
        return response()->json(['error' => $validator->errors()], 422);
    }
    
    // 2
    $user = User::where('email', $request->email)->first();
 
    // 3
    if (!$user || !Hash::check($request->password, $user->password) {
        return response()->json(['error' => 'The provided credentials are incorrect.'], 422);
    }
    
    // 4
    return response()->json(['token' => $user->createToken($request->device_name)->plainTextToken]);
}
```

Here’s what this code does:

1. We once again validate the request, and return the errors if validation fails.
2. We get the first `User` from our database for the submitted email address. The email is unique, so at most this will return one user.
3. If the user doesn’t exist (so the email was incorrect), or the password isn’t correct, we return an error the app can pick up.
4. We return the generated token.

The scaffolding of our authentication is now complete! Let’s quickly create a route that’ll allow us to get the name of the logged in user.

In your `routes/api.php` file, add the following code:

```php
Route::middleware('auth:sanctum')->get('/name', function (Request $request) {
    return response()->json(['name' => $request->user()->name]);
});
```

Here we use the `'auth:sanctum'` middleware. This will make sure the api token is present in the headers of the request, and will return an error if it isn’t. When the request works, we can use `$request->user()` to get access to the user model.

There’s a lot more I’d like to write about the things we can easily do with Sanctum, but I’ll refrain from doing so to keep this article short. If you want to learn more about the possibilities, like adding _abilities_ and revoking tokens, take a look at the [documentation](https://github.com/laravel/sanctum).

## Let’s authenticate
hunter2 is not a valid password with the validation rules we defined.

It’s time to put our api to the test. Let’s open up Xcode and quickly whip up a login screen. After doing whatever client side validation you want to perform, pass the values from the fields in your register form to the function you’ll use to perform the HTTP request. To provide code that can be used regardless of your preferred architecture, I’ll simply show you how to construct the request to register a user. Make sure to include the `application/json` `Content-Type header`, or your requests won’t succeed.

```swift
var request = URLRequest(url: URL(string: "http://yourprojecturl.test/api/sanctum/register")!)
request.httpMethod = "POST"
request.addValue("application/json", forHTTPHeaderField: "Content-Type")
guard let body = try? jsonEncoder.encode([
    "name": name,
    "password": password,
    "email": email,
    "device_name": deviceName
]) else {
    return
}

request.httpBody = body
```

The request to log in is very similar, we simply replace the final url endpoint with `/token` and remove the `name` from the body. A successful request to any of these endpoints will result in the following response body:

```json
{
 "token": "<api token>"
}
```

After your user registers their account or logs in, make sure to store this token somewhere. We’ll use it in this next request to retrieve their name from the backend:

```swift
var request = URLRequest(url: URL(string: "http://yourprojecturl.test/api/name"))
request.httpMethod = "GET"
request.addValue("Bearer \(apiToken)", forHTTPHeaderField: "Authorization")
```

## A quick recap

Let’s briefly go over the things I explained in this article, to make sure we’re on the same page.

- We set up some scaffolding with Laravel and Sanctum to handle user authentication.
- We can create routes using the `'auth:sanctum'` middleware that will validate the token sent in the headers, and gives us access to the corresponding user model.
- We can create the requests to consume our API.

## Next steps

As I mentioned before, this just scratches the surface of what we can do with Sanctum. You can create tokens with different abilities so some users can perform actions while others can’t. Or you can set the token to expire after a certain amount of time, so the user has to request a new one. Sanctum is still in beta, so expect things to change and new features to be added.

Hopefully this article gave you some insights in how Sanctum can be a simple alternative to other authorization methods. If you’re a mobile developer and you have never worked with Laravel before, I highly recommend spending some time with it. You’ll be able to build the backend for your apps in no time.

If you have any questions, the best way to reach out to me is through [Twitter](https://twitter.com/jillevd_w). If you like reading this, please let me know if you’d like to read more about Laravel, Swift, or a combination of the two.