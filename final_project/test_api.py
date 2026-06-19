import requests
s = requests.session()

# test get all books
r = s.get('http://localhost:5000/')
print('POSTMAN site hase been updated, testing api in locally...')
print('TASK 1:')
print(str(r.text)[0:71])
print('')

# test get book by isbn
r = s.get('http://localhost:5000/isbn/1')
print('TASK 2:')
print(r.text)
print('')

# test get books based on author
r = s.get('http://localhost:5000/author/Unknown')
print('TASK 3:')
print(r.text)
print('')

# test get books based on title
r = s.get('http://localhost:5000/title/The Divine Comedy')
print('TASK 4:')
print(r.text)
print('')

# test get books based on title
r = s.get('http://localhost:5000/review/1')
print('TASK 5:')
print(r.text)
print('')

# register user
json = {"username":"user3", "password":"password2"}
r = s.post('http://localhost:5000/register', json = json)
print('TASK 6:')
print(r.text)
print('')

# test login
json = {"username":"user3", "password":"password2"}
r = s.post('http://localhost:5000/customer/login', json = json)
print('TASK 7:')
print(r.text)
print('')

# add or update review using put
review_str = 'this is great'
r = s.put(f'http://localhost:5000/customer/auth/review/1?review={review_str}', json = json)
print('TASK 8:')
print(r.text)
print('')

r = s.get('http://localhost:5000/isbn/1')
print(r.json())
print('')

# test delete
r = s.delete('http://localhost:5000/customer/auth/review/1')
print('TASK 9:')
print(r.text)
print('')

r = s.get('http://localhost:5000/isbn/1')
print(r.json())
print('')


# test get books with async
r = s.get('http://localhost:5000/books-async')
print('TASK 10:')
print(str(r.text)[0:71])
print('')


# test get book by isbn with async
r = s.get('http://localhost:5000/async-isbn/5')
print('TASK 11:')
print(r.text)
print('')


# test get book by isbn with async
r = s.get('http://localhost:5000/async-author/Unknown')
print('TASK 13:')
print(r.text)
print('')


# test get book by isbn with async
r = s.get('http://localhost:5000/async-title/The Divine Comedy')
print('TASK 14:')
print(r.text)
# print('')