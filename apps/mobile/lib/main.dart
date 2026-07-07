import 'package:flutter/material.dart';

void main() {
  runApp(const OmniRemoteApp());
}

class OmniRemoteApp extends StatelessWidget {
  const OmniRemoteApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'OmniRemote AI',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: Colors.blue,
        ),
        useMaterial3: true,
      ),
      home: const HomeScreen(),
    );
  }
}

class Device {
  final String name;
  final String type;
  final bool connected;

  Device({
    required this.name,
    required this.type,
    this.connected = false,
  });
}

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final List<Device> devices = [];

  void addDevice() {
    setState(() {
      devices.add(
        Device(
          name: "Living Room TV",
          type: "Smart TV",
          connected: true,
        ),
      );
    });
  }

  void openRemote(Device device) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => RemoteScreen(device: device),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("OmniRemote AI"),
      ),
      body: devices.isEmpty
          ? const Center(
              child: Text(
                "No devices connected.\nTap + to add a device.",
                textAlign: TextAlign.center,
              ),
            )
          : ListView.builder(
              itemCount: devices.length,
              itemBuilder: (context, index) {
                final device = devices[index];

                return ListTile(
                  leading: Icon(
                    device.connected
                        ? Icons.tv
                        : Icons.tv_off,
                  ),
                  title: Text(device.name),
                  subtitle: Text(device.type),
                  trailing: Icon(
                    device.connected
                        ? Icons.check_circle
                        : Icons.error,
                  ),
                  onTap: () => openRemote(device),
                );
              },
            ),
      floatingActionButton: FloatingActionButton(
        onPressed: addDevice,
        child: const Icon(Icons.add),
      ),
    );
  }
}

class RemoteScreen extends StatelessWidget {
  final Device device;

  const RemoteScreen({
    super.key,
    required this.device,
  });

  void sendCommand(String command) {
    debugPrint(
      "Sending command: $command to ${device.name}",
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(device.name),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            ElevatedButton(
              onPressed: () => sendCommand("POWER"),
              child: const Text("Power"),
            ),
            const SizedBox(height: 20),
            Row(
              mainAxisAlignment:
                  MainAxisAlignment.spaceEvenly,
              children: [
                ElevatedButton(
                  onPressed: () =>
                      sendCommand("VOLUME_DOWN"),
                  child: const Text("-"),
                ),
                ElevatedButton(
                  onPressed: () =>
                      sendCommand("VOLUME_UP"),
                  child: const Text("+"),
                ),
              ],
            ),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: () => sendCommand("HOME"),
              child: const Text("Home"),
            ),
          ],
        ),
      ),
    );
  }
}