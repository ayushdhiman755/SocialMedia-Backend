import re
import nltk
nltk.download('stopwords')
from nltk.corpus import stopwords
from nltk.stem.porter import PorterStemmer
import joblib
from sklearn.feature_extraction.text import CountVectorizer
cv = CountVectorizer(max_features=1500)


classifier=joblib.load("CyberBully_model2.sav")
def predict(comment):
    lst=[]
    lst.append(comment)
    review_comment = re.sub('[^a-zA-Z]', ' ', lst[0])
    review_comment = review_comment.lower()
    review_comment = review_comment.split()
    ps = PorterStemmer()
    all_stopwords = stopwords.words('english')
    all_stopwords.remove('not')
    review_comment = [ps.stem(word) for word in review_comment if not word in set(all_stopwords)]
    review_comment = ' '.join(review_comment)
    review_comment_array=cv.transform([review_comment]).toarray()                                                                            
    y_pred_comment=classifier.predict(review_comment_array)
    return y_pred_comment[0]

# print("dlkgn'as")
print(predict("comment check for bully"))