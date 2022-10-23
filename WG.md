# WG 维护

## 启动

```bash
$ bundle exec jekyll serve -w --detach
Configuration file: /home/ubuntu/wholegospel.github.io/_config.yml
            Source: /home/ubuntu/wholegospel.github.io
       Destination: /home/ubuntu/wholegospel.github.io/_site
 Incremental build: disabled. Enable with --incremental
      Generating...
                    done in 3.573 seconds.
 Auto-regeneration: disabled when running server detached.
    Server address: http://127.0.0.1:4000/
Server detached with pid '3913697'. Run `pkill -f jekyll' or `kill -9 3913697' to stop the server.
```

## 更新

```bash
$ git pull; bundle exec jekyll build
```



