/**
 * Created by Никита on 01.04.2017.
 */
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/myStore');

const Schema = mongoose.Schema;
const schema = new Schema({
  title: String,
  summary: String,
  createdAt: { type: Date, default: Date.now },
  author: String,
  content: String,
  tags: [String],
});

schema.statics.findById = function (_id, cb) {
  return this.find({ _id: new mongoose.Types.ObjectId(_id) }, cb);
};

const ArticleCollection = mongoose.model('Article', schema);
exports.ArticleCollection = ArticleCollection;

const schemaAuthorsIndex = new Schema({
  author: String,
  ids: [Schema.Types.ObjectId],
});

schemaAuthorsIndex.statics.findByAuthor = function (author, cb) {
  return this.find({ author }, cb);
};

const AuthorsIndexCollection = mongoose.model('AuthorsIndex', schemaAuthorsIndex);
exports.AuthorsIndexCollection = AuthorsIndexCollection;



const schemaTagsIndex = new Schema({
  tagKey: String,
  ids: [Schema.Types.ObjectId],
});

schemaTagsIndex.statics.findByTagKey = function (tagKey, cb) {
  return this.find(tagKey, cb);
};

const TagsIndexCollection = mongoose.model('TagsIndex', schemaTagsIndex);
exports.TagsIndexCollection = TagsIndexCollection;
