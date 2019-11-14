import faust

class Greeting(faust.Record):
    from_name: str # our transaction variables
    to_name: str   # 

app = faust.App('hello-app', broker='kafka://localhost:9092')


topic = app.topic('test', value_type=Greeting)# this is choosing topic and greeting is a data strecture 

@app.agent(topic)
async def hello(greetings):
    async for greeting in greetings:
        f'Hello from {greeting.from_name} to {greeting.to_name}' # formating the way you sending to consumer

@app.timer(interval=5.0)
async def example_sender(app):
    await hello.send(
        value=Greeting(from_name='TINDEL', to_name='ABDUL'),
    )

# @app.agent(topic)
# async def process(stream):
#     async for value in stream:
#         print(value)
        

if __name__ == '__main__':
    app.main()

# Options:
#   --console-port RANGE[1-65535]   when --debug: Port to run debugger console
#                                   on.  [default: 50101]
#   --blocking-timeout FLOAT        when --debug: Blocking detector timeout.
#                                   [default: 10.0]
#   -l, --loglevel [crit|error|warn|info|debug]
#                                   Logging level to use.  [default: WARN]
#   -f, --logfile PATH              Path to logfile (default is <stderr>).
#   -L, --loop [aio|gevent|eventlet|uvloop]
#                                   Event loop implementation to use.  [default:
#                                   aio]
#   --json                          Return output in machine-readable JSON
#                                   format  [default: False]
#   -D, --datadir DIRECTORY         Directory to keep application state.
#                                   [default: {conf.name}-data]
#   -W, --workdir DIRECTORY         Working directory to change to after start.
#   --no-color, --no_color / --color, --color
#                                   Enable colors in output.  [default: False]
#   --debug / --no-debug            Enable debugging output, and the blocking
#                                   detector.  [default: False]
#   -q, --quiet / --no-quiet        Silence output to <stdout>/<stderr>.
#                                   [default: False]
#   -A, --app TEXT                  Path of Faust application to use, or the
#                                   name of a module.
#   --version                       Show the version and exit.
#   --help                          Show this message and exit.

# Commands:
#   agents          List agents.
#   clean_versions  Delete old version directories.
#   completion      Output shell completion to be evaluated by...
#   livecheck       Manage LiveCheck instances.
#   model           Show model detail.
#   models          List all available models as a tabulated...
#   reset           Delete local table state.
#   send            Send message to agent/topic.
#   tables          List available tables.
#   worker          Start worker instance for given app.