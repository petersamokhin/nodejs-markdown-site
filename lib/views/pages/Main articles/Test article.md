# Test header 1

## Test header 2

- List element 0
- List element 1
* List element 2

---

### Some Java snippet
```java
class TestJavaCode {

    /**
     * psvm 'Hello world!'
     * 
     * @param args Args
     */
    public static void main(String[] args) {
        System.out.println("Hello world");
    }
}
```

---

### Some Kotlin snippet
```kotlin
object TestKotlinCode {
    const val HELLO = "world"
    
    /**
     * Some test kdoc.
     * 
     * @param param Param
     * @param args Args
     * @return Boolean false
     */
    fun someTestFun(param: Int, vararg args: String): Boolean {
        return false
    }
} 
```

---

### Some test table

| Cell 0 | Cell 1 | Cell 2 |
| :------: | :------ | ------: |
| Cell 3 | Cell 4 | Cell 5 |

---

### Test link
[I'm an inline-style link](https://www.google.com)

---

### Test image
Inline-style: 
![alt text](https://github.com/adam-p/markdown-here/raw/master/src/common/images/icon48.png "Logo Title Text 1")

---

### Test quotes
> Blockquotes are very handy in email to emulate reply text.
> This line is part of the same quote.
{:.note}

Quote break.

> This is a very long line that will still be quoted properly when it wraps. Oh boy let's keep writing to make sure this is long enough to actually wrap for everyone. Oh, you can *put* **Markdown** into a blockquote. 
