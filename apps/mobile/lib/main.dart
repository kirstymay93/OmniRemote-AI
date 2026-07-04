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
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.blue),
        useMaterial3: true,
      ),
      home: const HomeScreen(),
    );
  }
}

class Device {
  final String name;
  final String type;

  Device(this.name, this.type);
}

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  List<Device> devices = [];

  void addDevice() {
    setState(() {
      devices.add(Device("Living Room TV", "TV"));
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
      appBar: AppBar(title: const Text("OmniRemote AI")),
      body: devices.isEmpty
          ? const Center(
              child: Text(
                "No devices yet.\nTap + to add one.",
                textAlign: TextAlign.center,
              ),
            )
          : ListView.builder(
              itemCount: devices.length,
              itemBuilder: (context, index) {
                final device = devices[index];
                return ListTile(
                  leading: const Icon(Icons.tv),
                  title: Text(device.name),
                  subtitle: Text(device.type),
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

  const RemoteScreen({super.key, required this.device});

  void press(String button) {
    debugPrint(button);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(device.name)),
      body: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          ElevatedButton(
            onPressed: () => press("Power"),
            child: const Text("Power"),
          ),
          const SizedBox(height: 20),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              ElevatedButton(
                onPressed: () => press("Vol -"),
                child: const Text("-"),
              ),
              ElevatedButton(
                onPressed: () => press("Vol +"),
                child: const Text("+"),
              ),
            ],
          ),
          const SizedBox(height: 20),
          ElevatedButton(
            onPressed: () => press("Home"),
            child: const Text("Home"),
          ),
        ],
      ),
    );
  }
}