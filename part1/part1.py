def palindrome(s):
    s2=""
    puncMarks=[' ',',','!',"'",'?',':',';','-','_','/']
    #removing punctuation marks and making the string lowercase
    for e in s:
        if(e not in puncMarks):
            s2=s2+e.lower()

    #checking if the resulting string is palindrome
    n=len(s2)
    for i in range(n//2):
        if(s2[i]!=s2[n-i-1]):
            return False

    return True

