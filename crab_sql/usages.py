# from crabmodel import CrabModel
# from crabmodel import ForeignKey
# from datatypes import DataTypes


# class User(CrabModel):
#     _columns = {
#         "name": DataTypes.varchar(max_length=25),
#         "email": DataTypes.emailfield(unique=True),
#     }


# class Post(CrabModel):
#     _columns = {
#         "title": DataTypes.varchar(max_length=50),
#         "content": DataTypes.varchar(max_length=255),
#         "author_id": DataTypes.integer(),
#     }
#     foreign_keys = [ForeignKey.create_foreignkey("author_id", "user")]


# User.insert({"name": "Ram", "email": "ram@example.com"})
# Post.insert({"title": "First Post", "content": "Hello World!", "author_id": 1})

# users = User.filter("name", "Ram")
# posts = Post.order_by("title", descending=True)
