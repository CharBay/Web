 
/*               
此项目为开源
开源地址：https://github.com/CharBay/Web
作者：CharBay
反馈：charbay@qq.com
*/

                var unsupport = false;
                if (typeof(Storage) !== "undefined") {} else {
                    alert('该网页不支持保存信息！！');
                    unsupport = true;
                }

                const list = document.getElementById("list");
                const ed = document.getElementById("ed");
                const go = document.getElementById("go");

                var myName = "无名之辈";
                if ((myName = localStorage.getItem("myName")) == null) {
                    var person = window.prompt("请输入你的昵称", "游客" + new Date().getTime());
                    if (person != null && person != "") {
                        localStorage.setItem("myName", person);
                        myName = person;
                    } else {
                        myName = "人机" + new Date().getTime();
                        localStorage.setItem("myName", myName);
                    }
                }
                myName = localStorage.getItem("myName");

                //console.log(myName);

                const mturl = /(https?|ftps?|files?):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/gi;
                const cbnbpwd = "@Char+Bay";


                class AC {
                    static async generateKey(password) {
                        const encoder = new TextEncoder();
                        const keyMaterial = await crypto.subtle.importKey(
                            'raw',
                            encoder.encode(password), {
                                name: 'PBKDF2'
                            },
                            false,
                            ['deriveKey']
                        );

                        return await crypto.subtle.deriveKey({
                                name: 'PBKDF2',
                                salt: new Uint8Array(16),
                                iterations: 100000,
                                hash: 'SHA-256'
                            },
                            keyMaterial, {
                                name: 'AES-GCM',
                                length: 256
                            },
                            false,
                            ['encrypt', 'decrypt']
                        );
                    }

                    static async encrypt(text, password) {
                        try {
                            const key = await this.generateKey(password);
                            const encoder = new TextEncoder();
                            const iv = crypto.getRandomValues(new Uint8Array(12));
                            const encrypted = await crypto.subtle.encrypt({
                                    name: 'AES-GCM',
                                    iv
                                },
                                key,
                                encoder.encode(text)
                            );

                            // 将IV和加密数据组合并转换为Base64
                            const combined = new Uint8Array(iv.length + encrypted.byteLength);
                            combined.set(iv, 0);
                            combined.set(new Uint8Array(encrypted), iv.length);

                            return btoa(unescape(String.fromCharCode(...combined)));
                        } catch (e) {
                            //console.error("加密错误:", e);
                            return null;
                        }
                    }

                    static async decrypt(encryptedText, password) {
                        try {
                            const key = await this.generateKey(password);
                            const combined = Uint8Array.from(atob(encryptedText), c => c.charCodeAt(0));
                            const iv = combined.slice(0, 12);
                            const data = combined.slice(12);

                            const decrypted = await crypto.subtle.decrypt({
                                    name: 'AES-GCM',
                                    iv
                                },
                                key,
                                data
                            );

                            return new TextDecoder().decode(decrypted);
                        } catch (e) {
                            //console.error("解密错误:", e);
                            return null;
                        }
                    }
                }


                function safeTextToHtml(text) {
                    const div = document.createElement('div');
                    div.textContent = text;
                    return div.innerHTML
                        .replace(/\n/gi, '<br> ')
                        .replace(/  /gi, ' &nbsp;');
                }

                function cbhttp(url, cb) {
                    fetch(url)
                        .then(response => {
                            if (!response.ok) {
                                return 'err';
                            } else {
                                return response.text();
                            }
                        })
                        .then(data => {
                            cb(data);
                        })
                        .catch(error => {
                            cb(error);
                        });
                }

                var update = "";

                setInterval(function() {
                    fetch('echo.php?key=Char_Bay')
                        .then(response => {
                            if (!response.ok) {
                                return 'err';
                            } else {
                                return response.text();
                            }
                        })
                        .then(data => {
                            var content = "",
                                gs = data;

                            if (update != data) {
                                update = data;
                            } else {
                                return;
                            }

                            if (data == 'err') {
                                list.innerHTML = '发生了未知错误(╥﹏╥)';
                                return;
                            }


                            var all = gs.split("_").length - 1;

                            //console.log(gs.split("_")[1].split(";")[0].split("{").join(""))

                            if (all > -1) {
                                for (let i = 0; i < all; i++) {
                                    AC.decrypt(gs.split("_")[i].split(";")[1].split("}").join(""), cbnbpwd).then((da1) => {
                                        AC.decrypt(gs.split("_")[i].split(";")[0].split("{").join(""), cbnbpwd).then(da2 => {
                                            var msg = ("" + safeTextToHtml(da1));

                                            let urls = msg.match(mturl) || [];

                                            urls.forEach((surl) => {
                                                msg = msg.split(surl).join(`<a style="color:bule" href="${surl}" traget="_slef">网页链接</a>`);
                                            });

                                            var name = ("" + safeTextToHtml(da2));

                                            let human = "left";
                                            if (name == myName) {
                                                human = "right";
                                            }


                                            content = content + `<div style="
                            display: grid;
                            justify-items: ` + human + `;
                                            "><a style="
                                            color:gold;
                                            box-shadow: ` + (human == 'right' ? '' : '-') + `2px 3px 2px white;
                                            font-size:12px;
                                            z-index:10;
                                            border-radius:15px;
                                            background:#787878;
                                            padding:3px 10px 3px 10px;
                                            height:17px;
                                            margin:0px 5px 0px 0px;
                                            max-width:200px;
                                            min-width:5px;
                            text-align:` + human + `;
                            ">` + name + `</a><div id="msg` + i + `" style="
                                    background:#3080ff;
                                    padding:10px;
                                    min-width:5px;
                                    min-height:18px;
                                    max-width:70%;
                                    overflow: hidden;
                                    //text-overflow: ellipsis;
                                    text-align:left;
                                    border-radius:10px;"
                            class=""><a>` + msg + `</a></div></div><br><br>`;

                                            list.innerHTML = content;

                                            window.scrollTo({
                                                top: document.body.scrollHeight,
                                                behavior: 'smooth'
                                            });
                                        });
                                    });


                                }
                            }



                        })
                        .catch(error => {
                            list.innerHTML = "程序错误(╥﹏╥)";
                            location.reload();
                        });
                }, 500);



                go.addEventListener("click", () => {
                    if (unsupport) {
                        return;
                    }

                    if (ed.value == "") {
                        return;
                    }


                    AC.encrypt("" + (myName), cbnbpwd).then(data1 => {
                        AC.encrypt((ed.value) /*.split("\n").join("@_dl_@").split(" ").join("@_sp_@")*/ , cbnbpwd).then(data2 => {

                            let formData = new FormData();
                            formData.append('name', data1);
                            formData.append('txt', data2);

                            //console.log('res:', data1 + "\n" + data2);

                            fetch('send.php', {
                                    method: 'POST',
                                    body: formData
                                })
                                .then(response => {
                                    if (!response.ok) {
                                        return 'err';
                                    } else {
                                        return response.text();
                                    }
                                })
                                .then(data => {
                                    if (data.match("发送成功")) {
                                        ed.value = '';
                                        ed.innerHTML = '';
                                    } else {
                                        ed.value = data;
                                    }
                                })
                                .catch(err => {
                                    ed.value = "发送失败:" + err;
                                });

                        });

                    });

                });


                document.addEventListener('keydown', function(event) {
                    // 检查 Enter 键 (keyCode 13 或 'Enter')
                    if (event.ctrlKey && (event.key === 'Enter' || event.keyCode === 13)) {
                        go.click();
                    } else if (event.key === 'Enter' || event.keyCode === 13) {
                    }

                    // 检查 Control 键 (keyCode 17 或 'Control')
                    if (event.key === 'Control' || event.keyCode === 17) {}

                    // 检查组合键 Ctrl + Enter

                });
