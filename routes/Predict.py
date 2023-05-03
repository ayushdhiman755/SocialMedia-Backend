import joblib
import re
from nltk.corpus import stopwords
from nltk.stem.porter import PorterStemmer
import sys
import os
# CVPath=os.path.join("")
cv = joblib.load("C:/COPY_FOT_DEPLOYMENT/socal_media/api/public/images/JuModel/CountVectorizer")
classifier=joblib.load("C:/COPY_FOT_DEPLOYMENT/socal_media/api/public/images/JuModel/classifier")
all_stopwords = stopwords.words('english')
all_stopwords.remove('not')
all_Classes=['not_cyberbullying', 'gender', 'religion', 'other_cyberbullying', 'age', 'ethnicity']

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
    return (y_pred_comment[0])

if __name__=="__main__":
    print(predict(sys.argv[1]))