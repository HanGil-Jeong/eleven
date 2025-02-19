$(document).ready(function() {
    $('.photo-section button').on('click', function() {
        if ($('#photoInput').length === 0) {
            $('body').append('<input type="file" id="photoInput" accept="image/*" style="display:none">');
        }   
        $('#photoInput').click();
    });

    $('body').on('change', '#photoInput', function(event) {
        var file = event.target.files[0];
        if (file) {
            var reader = new FileReader();
            reader.onload = function(e) {
                $('.photo-placeholder').css({
                    'background-image': 'url(' + e.target.result + ')',
                    'background-size': 'cover',
                    'background-position': 'center'
                });
            };
        reader.readAsDataURL(file);
        }
    });

    $('.cancel-btn').on('click', function() {
        $('form')[0].reset();
        $('.photo-placeholder').css('background-image', 'none');
        $('#photoInput').val('');
    });

    $('.edit-btn').on('click', function(e) {
        e.preventDefault();

        var name   = $('#name').val();
        var age    = $('#age').val();
        var mbti   = $('#mbti').val();
        var oneWord = $('#oneWord').val();
        var hobby  = $('#hobby').val();
        var selfIntro    = $('#selfIntro').val();

        if (!name || !age) {
            alert("이름과 나이는 필수 입력 항목입니다.");
            return;
        }

        var photoFile = $('#photoInput')[0] ? $('#photoInput')[0].files[0] : null;

        if (photoFile) {
            var photoRef = storage.ref('photos/' + Date.now() + '_' + photoFile.name);
            var uploadTask = photoRef.put(photoFile);

            uploadTask.on('state_changed',
                function(error) {
                    console.error("사진 업로드 에러: ", error);
                    alert("사진 업로드에 실패했습니다.");
                },
                function() {
                    uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                        saveData(name, age, mbti, oneWord, hobby, selfIntro, downloadURL);
                    });
                }
            );
        } else {
            saveData(name, age, mbti, oneWord, hobby, selfIntro, null);
        }
    });

    function saveData(name, age, mbti, oneWord, hobby, selfIntro, image) {
        db.collection("users").add({
            name: name,
            age: Number(age),
            mbti: mbti,
            oneWord: oneWord,
            hobby: hobby,
            selfIntro: selfIntro,
            image: image,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then(function(docRef) {
            alert("데이터가 성공적으로 저장되었습니다!");
            $('form')[0].reset();
            $('.photo-placeholder').css('background-image', 'none');
            $('#photoInput').val('');
            window.location.href = "main.html";
        })
        .catch(function(error) {
            console.error("데이터 저장 실패: ", error);
            alert("데이터 저장에 실패했습니다.");
        });
    }
});