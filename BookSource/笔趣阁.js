function search(query){
    var baseUrl = "http://www.b5200.org/";
    var url = "/modules/article/search.php?searchkey={{key}}".replace("{{key}}",query);
    var doc = get({baseUrl:baseUrl,url:url})

    var bookListEl = doc.select("table > tbody > tr");
     Log.e("BookSource",">>>>>bookListEl Size "+bookListEl.size()+">>>>>>>>>>>>>>>>>>>>")
    var results = new ArrayList();
    for (var i=1;i<bookListEl.size();i++){
        var bookEl = bookListEl.get(i);
        Log.e("BookSource",bookEl.tagName()+">>>>>"+i+">>>>>>>>>>>>>>>>>>>>")
        Log.e("BookSource","bookEl>>>>")
        Log.e("BookSource",bookEl)
        var result = new SearchResult();
        result.source = source;
        Log.e("BookSource","bookTitle>>>>")
        result.bookTitle = bookEl.select("td a").get(0).text();
        Log.e("BookSource",result.bookTitle)
        Log.e("BookSource","bookUrl>>>>")
        result.bookUrl = bookEl.select("td a").get(0).absUrl("href");
        Log.e("BookSource",result.bookUrl)
        Log.e("BookSource","bookAuthor>>>>")
        result.bookAuthor = bookEl.select("td").get(2).text();
        Log.e("BookSource",result.bookAuthor)
        results.add(result);
        Log.e("BookSource",bookEl.tagName()+"<<<<<"+i+"<<<<<<<<<<<<<<<<<<<<")
    }
    return results;
}

function getDetails(url){
    var doc = get({url:url});
    Log.e("BookSource",url)
    var book = new Book();
    book.url = url;
    Log.e("BookSource","title>>>>")
    book.title = doc.select("meta[property=\"og:novel:book_name\"]").attr("content");
    Log.e("BookSource",book.title)
    Log.e("BookSource","author>>>>")
    book.author = doc.select("meta[property=\"og:novel:author\"]").attr("content");
    Log.e("BookSource",book.author)
    Log.e("BookSource","intro>>>>")
    book.intro = doc.select("meta[property=\"og:description\"]").attr("content");
    Log.e("BookSource",book.intro)
    Log.e("BookSource","cover>>>>")
    book.cover = doc.select("#fmimg img").get(0).absUrl("src");
    Log.e("BookSource",book.cover)
    var elements = doc.select("#list > dl > *");
    Log.e("BookSource","章节列表数量："+elements.size())
    var chapterList = new ArrayList();
    var dt = false;
    for (i = 1; i < elements.size(); i++) {
        var el = elements.get(i);
        Log.e("BookSource",el)
        if(!dt && el.tagName() == "dt"){
            dt = true;
            continue
        }
        if(!dt){
            continue
        }

        var chapter = new Chapter();
        Log.e("BookSource","chapter.title>>>>")
        chapter.title = el.select("a").get(0).text()
        Log.e("BookSource",chapter.title)
        Log.e("BookSource","chapter.url>>>>")
        chapter.url = el.select("a").get(0).absUrl("href");
        Log.e("BookSource",chapter.title)
        chapterList.add(chapter);
    }
    book.chapterList = chapterList;
    return book;
}

function getChapterContent(url){
    var doc = get({url:url});
    return doc.select("#content").html()
}